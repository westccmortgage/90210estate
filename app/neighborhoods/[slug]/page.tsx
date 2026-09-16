import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingExplorer } from "../../components/listing-explorer";
import { PageHero } from "../../components/page-hero";
import { getMarketplaceListings } from "../../lib/crm-marketplace";
import { getNeighborhood, neighborhoods } from "../../lib/neighborhoods";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: { slug: string } };

const relatedNeighborhoods: Record<string, string[]> = {
  "beverly-hills": ["beverly-hills-flats", "trousdale-estates", "beverly-hills-post-office", "holmby-hills"],
  "beverly-hills-flats": ["beverly-hills", "trousdale-estates", "century-city"],
  "trousdale-estates": ["beverly-hills", "beverly-hills-gateway", "bel-air"],
  "beverly-hills-gateway": ["beverly-hills", "trousdale-estates", "bel-air"],
  "beverly-hills-post-office": ["beverly-hills", "bel-air", "sunset-strip"],
  "bel-air": ["holmby-hills", "beverly-hills-post-office", "century-city"],
  "holmby-hills": ["bel-air", "beverly-hills", "century-city"],
  "sunset-strip": ["west-hollywood-west", "beverly-hills-post-office", "beverly-hills"],
  "west-hollywood-west": ["sunset-strip", "beverly-hills", "century-city"],
  "century-city": ["holmby-hills", "beverly-hills", "west-hollywood-west"],
};

const zipHubNeighborhoods = new Set([
  "beverly-hills",
  "beverly-hills-flats",
  "trousdale-estates",
  "beverly-hills-gateway",
  "beverly-hills-post-office",
]);

export function generateStaticParams() {
  return neighborhoods.map((neighborhood) => ({ slug: neighborhood.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const neighborhood = getNeighborhood(params.slug);
  if (!neighborhood) return { title: "Neighborhood not found", robots: { index: false, follow: false } };

  const canonical = `/neighborhoods/${neighborhood.slug}`;
  return {
    title: neighborhood.seoTitle,
    description: neighborhood.description,
    alternates: { canonical },
    openGraph: { images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "90210 Estate" }],
      title: neighborhood.seoTitle,
      description: neighborhood.description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function NeighborhoodPage({ params }: Props) {
  const neighborhood = getNeighborhood(params.slug);
  if (!neighborhood) notFound();

  const listings = await getMarketplaceListings(neighborhood.feedArea);
  const canonical = `https://90210estate.com/neighborhoods/${neighborhood.slug}`;
  const related = (relatedNeighborhoods[neighborhood.slug] || [])
    .map((slug) => getNeighborhood(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: neighborhood.seoTitle,
        description: neighborhood.description,
        url: canonical,
        about: {
          "@type": "Place",
          name: neighborhood.name,
          address: { "@type": "PostalAddress", addressRegion: "CA", addressCountry: "US" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Neighborhoods",
            item: "https://90210estate.com/neighborhoods",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: neighborhood.name,
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={neighborhood.region}
        title={`${neighborhood.name} real estate and homes for sale.`}
        description={neighborhood.description}
      />

      <section className="section shell split intro">
        <div>
          <p className="eyebrow">Local orientation</p>
          <h2>What buyers compare in {neighborhood.name}.</h2>
        </div>
        <div className="body-copy">
          <p>{neighborhood.overview}</p>
          <p>{neighborhood.housing}</p>
          <p>{neighborhood.planning}</p>
          {zipHubNeighborhoods.has(neighborhood.slug) ? (
            <Link className="text-link" href="/90210-homes-for-sale">
              Browse homes for sale across 90210 <span>→</span>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="section soft">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Before the offer</p>
            <h2>Three items worth reviewing early.</h2>
          </div>
          <div className="data-grid">
            {neighborhood.reviewPoints.map((point, index) => (
              <article className="data-card" key={point}>
                <p className="eyebrow">0{index + 1}</p>
                <h3>{point}</h3>
                <p>Confirm the property-specific facts with the appropriate listing, inspection, insurance, legal, or lending professional before relying on them.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="row-heading section-heading">
          <div>
            <p className="eyebrow">Authorized marketplace inventory</p>
            <h2>Current {neighborhood.name} listings.</h2>
          </div>
          <Link className="text-link" href={`/listings?area=${encodeURIComponent(neighborhood.feedArea)}`}>Search all homes <span>→</span></Link>
        </div>
        <ListingExplorer listings={listings} />
      </section>

      {related.length > 0 ? (
        <section className="section soft">
          <div className="shell">
            <div className="section-heading row-heading">
              <div>
                <p className="eyebrow">Nearby Westside areas</p>
                <h2>Other neighborhoods buyers compare.</h2>
              </div>
              <Link className="text-link desktop-only" href="/neighborhoods">
                Explore all neighborhoods <span>→</span>
              </Link>
            </div>
            <div className="data-grid">
              {related.map((area) => (
                <article className="data-card" key={area.slug}>
                  <p className="eyebrow">{area.region}</p>
                  <h3>{area.name}</h3>
                  <p>{area.description}</p>
                  <Link href={`/neighborhoods/${area.slug}`}>Explore {area.name} →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section midnight">
        <div className="shell finance-band">
          <div>
            <p className="eyebrow gold-text">Next steps</p>
            <h2>Property, representation, and financing in the right order.</h2>
            <p>Contact the named listing agent for property and showing questions. If financing is part of the purchase, review the loan structure separately before offer deadlines make the choices narrower.</p>
          </div>
          <div className="finance-actions">
            <Link className="button gold" href="/agents">Find a local agent</Link>
            <Link className="button glass" href="/financing">Review financing</Link>
          </div>
        </div>
      </section>

      <section className="section shell">
        <p className="notice">
          Neighborhood descriptions are general orientation only. Boundaries, jurisdiction, school attendance, property condition, insurance, views, permits, and other material facts must be independently verified for the specific property.
        </p>
      </section>
    </main>
  );
}
