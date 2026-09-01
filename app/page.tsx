import type { Metadata } from "next";
import Link from "next/link";
import { LocationSearch } from "./components/location-search";

export const metadata: Metadata = {
  title: "Beverly Hills Real Estate & Homes for Sale",
  description: "Explore Beverly Hills real estate, homes for sale, open houses, neighborhoods, and local agents across Beverly Hills, Bel Air, Holmby Hills, and the Westside.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Beverly Hills Real Estate & Homes for Sale | 90210 Estate",
    description: "Agent-authorized homes, open houses, neighborhoods, and local real estate professionals across Beverly Hills and the Westside.",
    url: "/",
    type: "website",
  },
};

const featuredNeighborhoods = [
  { name: "Beverly Hills", slug: "beverly-hills", description: "Iconic residential streets, established estates, and a globally recognized city center." },
  { name: "Trousdale Estates", slug: "trousdale-estates", description: "Architectural homes, privacy, and expansive views above the city." },
  { name: "Beverly Hills Post Office", slug: "beverly-hills-post-office", description: "Hillside living and winding residential streets beyond the Beverly Hills city boundary." },
  { name: "Bel Air", slug: "bel-air", description: "Gated estates, generous lots, and secluded canyon settings across the hills." },
  { name: "Holmby Hills", slug: "holmby-hills", description: "Landmark estates and quiet residential avenues in the Platinum Triangle." },
  { name: "Sunset Strip", slug: "sunset-strip", description: "View properties, contemporary architecture, and quick access to West Hollywood." },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="shell hero-content">
          <p className="eyebrow light">Beverly Hills · Bel Air · Holmby Hills</p>
          <h1>Exceptional homes.<br />One iconic market.</h1>
          <p className="hero-copy">
            Explore agent-presented homes, distinctive neighborhoods, open houses,
            and local professionals across Beverly Hills and the surrounding Westside.
          </p>
          <div className="hero-actions">
            <Link className="button gold" href="/listings">Browse homes</Link>
            <Link className="button glass" href="/for-realtors">Submit a listing</Link>
          </div>
          <p className="hero-note">Built for buyers, sellers, and independent local agents.</p>
        </div>
      </section>

      <LocationSearch />

      <section className="section shell split intro">
        <div>
          <p className="eyebrow">A better local starting point</p>
          <h2>Not one brokerage’s inventory. The local market.</h2>
        </div>
        <div className="body-copy">
          <p>
            90210 Estate is an independent showcase for properties represented by
            agents throughout Beverly Hills and the Westside. Every listing keeps the
            listing agent visible and connected to the inquiry.
          </p>
          <Link className="text-link" href="/about">How the marketplace works <span>→</span></Link>
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <div className="section-heading row-heading">
            <div>
              <p className="eyebrow">Local coverage</p>
              <h2>Find your place in the hills.</h2>
            </div>
            <Link className="text-link desktop-only" href="/neighborhoods">Explore all neighborhoods <span>→</span></Link>
          </div>
          <div className="neighborhood-grid">
            {featuredNeighborhoods.map((area, index) => (
              <Link href={`/neighborhoods/${area.slug}`} className="neighborhood" key={area.slug}>
                <span className="neighborhood-number">0{index + 1}</span>
                <h3>{area.name}</h3>
                <p>{area.description}</p>
                <span className="arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell listing-invite">
        <div className="listing-invite-copy">
          <p className="eyebrow">Featured homes</p>
          <h2>Real listings, shown with permission.</h2>
          <p>
            We are opening 90210 Estate to local listing agents now. Homes appear
            here only after the agent’s information and permission are verified—no
            copied listings and no invented inventory.
          </p>
          <div className="inline-actions">
            <Link className="button navy" href="/for-realtors">Add your listing</Link>
            <Link className="text-link" href="/listings">View listings <span>→</span></Link>
          </div>
        </div>
        <div className="listing-preview" aria-label="Marketplace launch status">
          <div className="status-pill">Founding listing partners</div>
          <p className="preview-kicker">Local agents</p>
          <p className="preview-title">Your property. Your name. Your lead.</p>
          <ul>
            <li>Agent attribution on every property</li>
            <li>Direct showing inquiries</li>
            <li>No cost for launch partners</li>
          </ul>
          <Link href="/for-realtors">See partner details →</Link>
        </div>
      </section>

      <section className="section midnight">
        <div className="shell finance-band">
          <div>
            <p className="eyebrow gold-text">Mortgage center</p>
            <h2>Found the home? Now check the financing.</h2>
            <p>
              Review a payment estimate, ask a scenario question, or begin a
              pre-approval with West Coast Capital Mortgage—separately from the listing agent.
            </p>
          </div>
          <div className="finance-actions">
            <Link className="button gold" href="/financing">Estimate payment</Link>
            <a className="button glass" href="https://westcoastcapitalmortgage.com" target="_blank" rel="noreferrer">Get pre-approved ↗</a>
          </div>
        </div>
      </section>

      <section className="section shell three-paths">
        <div className="path">
          <span>01</span>
          <h3>Buying</h3>
          <p>Browse verified local homes and learn the character of each neighborhood.</p>
          <Link href="/listings">Search homes →</Link>
        </div>
        <div className="path">
          <span>02</span>
          <h3>Representing a listing</h3>
          <p>Add exposure while keeping your name, your relationship, and your inquiry.</p>
          <Link href="/for-realtors">For local Realtors →</Link>
        </div>
        <div className="path">
          <span>03</span>
          <h3>Planning financing</h3>
          <p>Estimate a payment and speak with a licensed mortgage professional.</p>
          <Link href="/financing">Mortgage center →</Link>
        </div>
      </section>
    </main>
  );
}
