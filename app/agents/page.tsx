import type { Metadata } from "next";
import Link from "next/link";
import { getMarketplaceAgents, grcrmLoginUrl } from "../lib/crm-marketplace";
import { PageHero } from "../components/page-hero";

// Listings are edited in GR CRM and must disappear from this site the moment
// they are unpublished or deleted there, so this page is never cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Local Real Estate Agents",
  description: "Meet verified independent real estate professionals serving Beverly Hills and the surrounding Westside.",
};

export default async function AgentsPage() {
  const agents = await getMarketplaceAgents();

  return (
    <main>
      <PageHero
        eyebrow="Local professionals"
        title="Meet the agents behind the listings."
        description="Each profile belongs to an independent local real estate professional. Their listings, brokerage, license, and contact details are presented with clear attribution."
      />
      <section className="section shell">
        {agents.length ? (
          <div className="agent-grid">
            {agents.map((agent) => (
              <article className="agent-card" key={agent.id}>
                {agent.avatar_url ? <img src={agent.avatar_url} alt={agent.display_name} /> : <div className="agent-placeholder">Local agent</div>}
                <div>
                  <p className="eyebrow">{agent.brokerage || "Beverly Hills real estate"}</p>
                  <h2><Link href={`/agents/${agent.slug}`}>{agent.display_name}</Link></h2>
                  {agent.title && <p>{agent.title}</p>}
                  {agent.dre_license && <p className="license-line">{agent.dre_license}</p>}
                  <Link className="text-link" href={`/agents/${agent.slug}`}>View profile <span>→</span></Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Founding partners</p>
            <h2>Verified local profiles are being added.</h2>
            <p>Agents receive a public profile and a private GR CRM workspace for managing listings, contacts, and email campaigns.</p>
            <a className="button navy" href={grcrmLoginUrl}>Create agent workspace</a>
          </div>
        )}
      </section>
    </main>
  );
}
