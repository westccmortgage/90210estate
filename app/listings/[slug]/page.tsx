import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getMarketplaceListing } from "../../lib/crm-marketplace";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getMarketplaceListing(params.slug);
  if (!listing) return { title: "Listing not found" };
  return {
    title: `${listing.address} | Homes for Sale`,
    description: listing.description || `${formatPrice(listing.price, listing.purpose)} property represented by a verified local agent.`,
  };
}

export default async function ListingPage({ params }: Props) {
  const listing = await getMarketplaceListing(params.slug);
  if (!listing) notFound();

  const photos = listing.photos || [];
  const agent = listing.agent;

  return (
    <main>
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
          {photos.slice(0, 6).map((photo, index) => (
            <img key={photo.url} src={photo.url} alt={photo.alt || `${listing.address}, photo ${index + 1}`} />
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

