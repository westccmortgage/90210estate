import type { Metadata } from "next";
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
  openGraph: {
    title: "Beverly Hills Homes for Sale | 90210 Estate",
    description: "Browse agent-authorized homes across Beverly Hills and the Westside.",
    url: "/listings",
    type: "website",
  },
};

export default async function ListingsPage() {
  const listings = await getMarketplaceListings();

  return (
    <main>
      <PageHero
        eyebrow="Local home search"
        title="Homes across Beverly Hills and the Westside."
        description="Browse properties published by their listing agents, with clear attribution and a direct path to the professional representing each home."
      />
      <section className="section shell">
        <ListingExplorer listings={listings} />
      </section>
    </main>
  );
}
