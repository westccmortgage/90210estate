import type { Metadata } from "next";
import { ListingExplorer } from "../components/listing-explorer";
import { PageHero } from "../components/page-hero";
import { getMarketplaceListings } from "../lib/crm-marketplace";

export const metadata: Metadata = {
  title: "Homes for Sale",
  description: "Search verified homes represented by local agents across Beverly Hills, Bel Air, and Holmby Hills.",
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
