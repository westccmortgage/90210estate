import type { Metadata } from "next";
import Link from "next/link";
import { ListingExplorer } from "../components/listing-explorer";
import { PageHero } from "../components/page-hero";
import { getMarketplaceListings } from "../lib/crm-marketplace";

// Listings are edited in GR CRM and must disappear from this site the moment
// they are unpublished or deleted there, so this page is never cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Beverly Hills Homes for Sale",
  description: "Search agent-authorized homes for sale across Beverly Hills, Bel Air, Holmby Hills, and nearby Westside neighborhoods.",
  alternates: { canonical: "/listings" },
  openGraph: { images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "90210 Estate" }],
    title: "Beverly Hills Homes for Sale | 90210 Estate",
    description: "Browse agent-authorized homes across Beverly Hills and the Westside.",
    url: "/listings",
    type: "website",
  },
};

export default async function ListingsPage() {
  const listings = await getMarketplaceListings();
  const canonical = "https://90210estate.com/listings";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Beverly Hills Homes for Sale",
    description:
      "Agent-authorized homes across Beverly Hills, Bel Air, Holmby Hills, and nearby Westside neighborhoods.",
    url: canonical,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: listings.length,
      itemListElement: listings.slice(0, 60).map((listing, index) => ({
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
        eyebrow="Local home search"
        title="Homes across Beverly Hills and the Westside."
        description="Browse properties published by their listing agents, with clear attribution and a direct path to the professional representing each home."
      />
      <section className="section shell">
        <div className="notice" style={{ marginBottom: 32 }}>
          Looking specifically for the Beverly Hills ZIP? <Link href="/90210-homes-for-sale"><strong>Explore 90210 homes for sale</strong></Link> with a guide to Beverly Hills, Trousdale Estates, and Beverly Hills Post Office.
        </div>
        <ListingExplorer listings={listings} />
      </section>
    </main>
  );
}
