import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getMarketplaceAgent } from "../../lib/crm-marketplace";

// Listings are edited in GR CRM and must disappear from this site the moment
// they are unpublished or deleted there, so this page is never cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getMarketplaceAgent(params.slug);
  if (!data) return { title: "Agent not found", robots: { index: false, follow: false } };

  const description = data.agent.bio || `Local real estate professional at ${data.agent.brokerage || "Beverly Hills and the Westside"}.`;
  const canonical = `/agents/${data.agent.slug}`;
  return {
    title: data.agent.display_name,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${data.agent.display_name} | 90210 Estate`,
      description,
      url: canonical,
      type: "profile",
      images: data.agent.avatar_url ? [{ url: data.agent.avatar_url, alt: data.agent.display_name }] : undefined,
    },
  };
}

export default async function AgentPage({ params }: Props) {
  const data = await getMarketplaceAgent(params.slug);
  if (!data) notFound();

  const { agent, listings } = data;
  const canonical = `https://90210estate.com/agents/${agent.slug}`;
  const agentJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: agent.display_name,
    url: canonical,
    image: agent.avatar_url || undefined,
    jobTitle: agent.title || "Real Estate Professional",
    description: agent.bio || undefined,
    worksFor: agent.brokerage ? { "@type": "Organization", name: agent.brokerage } : undefined,
    telephone: agent.phone || undefined,
    email: agent.email || undefined,
    sameAs: agent.website ? [agent.website] : undefined,
    areaServed: agent.service_areas?.map((area) => ({ "@type": "Place", name: area })),
    identifier: agent.dre_license || undefined,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(agentJsonLd) }} />
      <section className="agent-profile-hero">
        <div className="shell agent-profile-head">
          <div className="agent-profile-photo">
            {agent.avatar_url ? <img src={agent.avatar_url} alt={agent.display_name} /> : <span>Local agent</span>}
          </div>
          <div>
            <p className="eyebrow">{agent.brokerage || "Independent local professional"}</p>
            <h1>{agent.display_name}</h1>
            {agent.title && <p className="agent-title">{agent.title}</p>}
            {agent.dre_license && <p className="license-line">{agent.dre_license}</p>}
            {(agent.phone || agent.email) && (
              <ul className="agent-contact-lines light">
                {agent.phone && <li><a href={`tel:${agent.phone}`}>{agent.phone}</a></li>}
                {agent.email && <li><a href={`mailto:${agent.email}`}>{agent.email}</a></li>}
              </ul>
            )}
            <div className="agent-profile-actions">
              {agent.phone && <a className="button gold" href={`tel:${agent.phone}`}>Call</a>}
              {agent.email && <a className="button glass" href={`mailto:${agent.email}`}>Email</a>}
              {agent.website && <a className="button glass" href={agent.website} target="_blank" rel="noopener noreferrer">Website</a>}
            </div>
          </div>
        </div>
      </section>

      <section className="section shell agent-profile-body">
        <article>
          <p className="eyebrow">About the agent</p>
          <h2>Local knowledge, direct representation.</h2>
          <p className="listing-description">{agent.bio || "Contact this agent directly to learn more about their experience, service areas, and current listings."}</p>
          {agent.service_areas && agent.service_areas.length > 0 && (
            <ul className="feature-chips">{agent.service_areas.map((area) => <li key={area}>{area}</li>)}</ul>
          )}
        </article>
        <aside className="notice">
          This agent is an independent real estate professional. 90210 Estate provides the local marketplace and profile page; listing representation remains with the named agent and brokerage.
        </aside>
      </section>

      <section className="section soft">
        <div className="shell">
          <div className="row-heading section-heading">
            <div><p className="eyebrow">Published properties</p><h2>{agent.display_name}&apos;s listings.</h2></div>
            <Link className="text-link" href="/listings">Browse all homes <span>→</span></Link>
          </div>
          {listings.length ? (
            <div className="market-listing-grid">
              {listings.map((listing) => {
                const photo = listing.photos?.find((item) => item.primary)?.url || listing.photos?.[0]?.url;
                return (
                  <article className="market-listing-card" key={listing.id}>
                    <Link className="market-listing-photo" href={`/listings/${listing.slug}`}>
                      {photo ? <img src={photo} alt={listing.address} /> : <span>Photo coming soon</span>}
                      {listing.status && <small>{listing.status}</small>}
                    </Link>
                    <div className="market-listing-copy">
                      <p className="market-price">{formatPrice(listing.price, listing.purpose)}</p>
                      <h2><Link href={`/listings/${listing.slug}`}>{listing.address}</Link></h2>
                      <p className="market-specs">
                        {listing.beds != null && <span>{listing.beds} beds</span>}
                        {listing.baths != null && <span>{listing.baths} baths</span>}
                        {listing.sqft != null && <span>{Number(listing.sqft).toLocaleString()} sq ft</span>}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state"><h2>No active published listings right now.</h2><p>Contact the agent directly for upcoming or off-market opportunities.</p></div>
          )}
        </div>
      </section>
    </main>
  );
}
