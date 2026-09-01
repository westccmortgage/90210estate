import type { Metadata } from "next";
import Link from "next/link";
import { ListingExplorer } from "../components/listing-explorer";
import { PageHero } from "../components/page-hero";
import { getMarketplaceListings } from "../lib/crm-marketplace";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "90210 Homes for Sale & Real Estate",
  description:
    "Explore authorized homes for sale in ZIP code 90210, including Beverly Hills and Beverly Hills Post Office, with direct listing-agent attribution and local buying guidance.",
  alternates: { canonical: "/90210-homes-for-sale" },
  openGraph: {
    title: "90210 Homes for Sale & Real Estate | 90210 Estate",
    description:
      "Authorized 90210 listings, Beverly Hills and BHPO neighborhood guidance, open houses, local agents, and financing planning.",
    url: "/90210-homes-for-sale",
    type: "website",
  },
};

export default async function Zip90210Page() {
  const allListings = await getMarketplaceListings();
  const listings = allListings.filter((listing) => {
    const is90210 = String(listing.zip || "").trim() === "90210";
    const isRental = String(listing.purpose || "").toLowerCase() === "rent";
    return is90210 && !isRental;
  });

  const canonical = "https://90210estate.com/90210-homes-for-sale";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "90210 Homes for Sale & Real Estate",
    description:
      "Authorized homes for sale in ZIP code 90210 with direct listing-agent attribution and local real estate guidance.",
    url: canonical,
    about: {
      "@type": "Place",
      name: "ZIP code 90210",
      address: {
        "@type": "PostalAddress",
        postalCode: "90210",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listings.slice(0, 30).map((listing, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://90210estate.com/listings/${listing.slug}`,
        name: listing.address,
      })),
    },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="ZIP code 90210"
        title="90210 homes for sale and real estate."
        description="Search agent-authorized homes in 90210, then narrow the decision by neighborhood, property condition, representation, and financing rather than relying on the ZIP code alone."
      />

      <section className="section shell split intro">
        <div>
          <p className="eyebrow">Understand the address</p>
          <h2>90210 is a ZIP code, not one uniform real estate market.</h2>
        </div>
        <div className="body-copy">
          <p>
            A 90210 mailing address can describe properties in different residential settings. Some homes are inside the City of Beverly Hills, while others use a Beverly Hills mailing address but are in Los Angeles areas commonly described as Beverly Hills Post Office. Municipal jurisdiction, site conditions, access, architecture, lot characteristics, and property history still need to be verified for the individual home.
          </p>
          <p>
            For buyers, that makes a street-level comparison more useful than treating every 90210 property as interchangeable. Start with the live authorized listings below, then use the neighborhood guides to compare the parts of the market that actually fit the purchase.
          </p>
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Popular 90210 searches</p>
            <h2>Compare the major submarkets.</h2>
          </div>
          <div className="data-grid">
            <article className="data-card">
              <p className="eyebrow">City of Beverly Hills</p>
              <h3>Beverly Hills</h3>
              <p>Established residential streets, estate properties, condos, remodeled homes, and new construction across a globally recognized market.</p>
              <Link href="/neighborhoods/beverly-hills">Beverly Hills real estate →</Link>
            </article>
            <article className="data-card">
              <p className="eyebrow">Hillside architecture</p>
              <h3>Trousdale Estates</h3>
              <p>View-oriented homes where architecture, site, privacy, alterations, insurance, and appraisal planning can materially affect the purchase.</p>
              <Link href="/neighborhoods/trousdale-estates">Trousdale Estates homes →</Link>
            </article>
            <article className="data-card">
              <p className="eyebrow">Mailing address vs jurisdiction</p>
              <h3>Beverly Hills Post Office</h3>
              <p>Hillside and canyon properties where buyers should verify the actual jurisdiction rather than relying on the Beverly Hills mailing address alone.</p>
              <Link href="/neighborhoods/beverly-hills-post-office">BHPO homes for sale →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="row-heading section-heading">
          <div>
            <p className="eyebrow">Authorized marketplace inventory</p>
            <h2>Current homes in 90210.</h2>
          </div>
          <Link className="text-link" href="/open-houses">90210-area open houses <span>→</span></Link>
        </div>
        <ListingExplorer listings={listings} />
      </section>

      <section className="section midnight">
        <div className="shell finance-band">
          <div>
            <p className="eyebrow gold-text">Before the offer</p>
            <h2>Separate the property decision from the financing decision.</h2>
            <p>
              Property questions stay with the named listing professional. If the purchase will be financed, review the loan structure, liquidity, appraisal, insurance, and documentation separately before an offer deadline reduces the available choices.
            </p>
          </div>
          <div className="finance-actions">
            <Link className="button gold" href="/agents">Find a local agent</Link>
            <Link className="button glass" href="/financing">Review financing</Link>
          </div>
        </div>
      </section>

      <section className="section shell">
        <p className="notice">
          Listing information appears only when intentionally published by an authorized agent. Neighborhood and ZIP-code descriptions are general orientation only. Verify jurisdiction, boundaries, property condition, permits, insurance, school attendance, and other material facts for the specific property.
        </p>
      </section>
    </main>
  );
}
