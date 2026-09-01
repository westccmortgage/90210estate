import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getMarketplaceListing } from "../../lib/crm-marketplace";

// Listings are edited in GR CRM and must disappear from this site the moment
// they are unpublished or deleted there, so this page is never cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getMarketplaceListing(params.slug);
  if (!listing) return { title: "Listing not found", robots: { index: false, follow: false } };

  const description = listing.description || `${formatPrice(listing.price, listing.purpose)} property represented by a verified local agent.`;
  const canonical = `/listings/${listing.slug}`;
  const primaryPhoto = listing.photos?.find((photo) => photo.primary)?.url || listing.photos?.[0]?.url;

  return {
    title: `${listing.address} | Homes for Sale`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${listing.address} | 90210 Estate`,
      description,
      url: canonical,
      type: "website",
      images: primaryPhoto ? [{ url: primaryPhoto, alt: listing.address }] : undefined,
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const listing = await getMarketplaceListing(params.slug);
  if (!listing) notFound();

  const photos = listing.photos || [];
  const agent = listing.agent;
  const canonical = `https://90210estate.com/listings/${listing.slug}`;
  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: listing.address,
    url: canonical,
    description: listing.description || undefined,
    image: photos.map((photo) => photo.url),
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.street || undefined,
      addressLocality: listing.city || undefined,
      addressRegion: listing.state || "CA",
      postalCode: listing.zip || undefined,
      addressCountry: "US",
    },
    numberOfBedrooms: listing.beds ?? undefined,
    numberOfBathroomsTotal: listing.baths ?? undefined,
    floorSize: listing.sqft ? { "@type": "QuantitativeValue", value: listing.sqft, unitCode: "FTK" } : undefined,
    offers: listing.price ? {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "USD",
      url: canonical,
      availability: "https://schema.org/InStock",
    } : undefined,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }} />
      <section className="listing-detail-hero">
        <div className="shell">
          <p className="eyebrow">{listing.status || "Local listing"}{listing.mls ? ` · MLS #${listing.mls}` : ""}</p>
          <h1>{listing.address}</h1>
          <p className="listing-detail-price">{formatPrice(listing.price, listing.purpose)}</p>
          <div className="listing-detail-specs">
            {listing.beds != null && <span><strong>{listing.beds}</strong> beds</span>}
            {listing.baths != null && <span><strong>{listing.baths}</strong> baths</span>}
            {listing.sqft != null && <span><strong>{Number(listing.sqft).toLocaleString()}</strong> sq ft</span>}
            {listing.property_type && <span>{listing.property_type}</span>}
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="shell listing-gallery">
          {photos.map((photo, index) => (
            <img
              key={photo.url}
              src={photo.url}
              alt={photo.alt || `${listing.address}, photo ${index + 1}`}
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </section>
      )}

      <section className="section shell listing-detail-grid">
        <article>
          <p className="eyebrow">Property details</p>
          <h2>About this home.</h2>
          <p className="listing-description">{listing.description || "Contact the listing agent for complete property details and showing availability."}</p>
          {listing.features && listing.features.length > 0 && (
            <ul className="feature-chips">{listing.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          )}
          {listing.video?.url && <a className="button outline" href={listing.video.url} target="_blank" rel="noopener noreferrer">Watch video tour</a>}
        </article>

        <aside className="agent-contact-card">
          <p className="eyebrow">Listing professional</p>
          {agent?.avatar_url && <img className="agent-avatar" src={agent.avatar_url} alt={agent.display_name} />}
          <h2>{agent?.display_name || "Local listing agent"}</h2>
          {agent?.title && <p>{agent.title}</p>}
          {agent?.brokerage && <p><strong>{agent.brokerage}</strong></p>}
          {agent?.dre_license && <p className="license-line">{agent.dre_license}</p>}
          {(agent?.phone || agent?.email) && (
            <ul className="agent-contact-lines">
              {agent?.phone && <li><a href={`tel:${agent.phone}`}>{agent.phone}</a></li>}
              {agent?.email && <li><a href={`mailto:${agent.email}?subject=${encodeURIComponent(`Question about ${listing.address}`)}`}>{agent.email}</a></li>}
            </ul>
          )}
          <div className="agent-contact-actions">
            {agent?.phone && <a className="button navy" href={`tel:${agent.phone}`}>Call agent</a>}
            {agent?.email && <a className="button outline" href={`mailto:${agent.email}?subject=${encodeURIComponent(`Question about ${listing.address}`)}`}>Email agent</a>}
            {agent && <Link className="text-link" href={`/agents/${agent.slug}`}>View agent profile <span>→</span></Link>}
          </div>
          <hr />
          <p><strong>Need financing?</strong><br />West Coast Capital Mortgage can provide a separate, no-obligation financing consultation.</p>
          <Link className="button gold" href={`/financing?property=${encodeURIComponent(listing.address)}&price=${listing.price || ""}`}>Estimate payment</Link>
        </aside>
      </section>
    </main>
  );
}
