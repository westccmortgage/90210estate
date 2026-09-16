import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/page-hero";
import { formatPrice, getMarketplaceListings } from "../lib/crm-marketplace";
import { cdnImage } from "../lib/image-cdn";

// Open-house times come from the listing agent's CRM and change often, so this
// page always reads the live feed instead of serving a build-time snapshot.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Beverly Hills & 90210 Open Houses",
  description:
    "Browse upcoming agent-authorized open houses in Beverly Hills, ZIP code 90210, and nearby Westside neighborhoods, with direct listing-agent attribution.",
  alternates: { canonical: "/open-houses" },
  openGraph: { images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "90210 Estate" }],
    title: "Beverly Hills & 90210 Open Houses | 90210 Estate",
    description:
      "Upcoming open houses published by the listing professionals representing each property across Beverly Hills, 90210, and the nearby Westside.",
    url: "/open-houses",
    type: "website",
  },
};

function windowLabel(startsAt?: string | null, endsAt?: string | null) {
  if (!startsAt) return null;
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return null;

  const day = start.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", timeZone: "America/Los_Angeles",
  });
  const from = start.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles",
  });

  const end = endsAt ? new Date(endsAt) : null;
  const to = end && !Number.isNaN(end.getTime())
    ? end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" })
    : null;

  return to ? `${day}, ${from} – ${to}` : `${day}, from ${from}`;
}

export default async function OpenHousesPage() {
  const listings = await getMarketplaceListings();
  const now = Date.now();

  const upcoming = listings
    .map((listing) => ({ listing, label: windowLabel(listing.open_house?.startsAt, listing.open_house?.endsAt) }))
    .filter(({ listing, label }) => {
      if (!label) return false;
      const ends = listing.open_house?.endsAt || listing.open_house?.startsAt;
      const endsAt = ends ? new Date(ends).getTime() : NaN;
      // Keep an event visible until it is actually over.
      return Number.isNaN(endsAt) ? true : endsAt >= now;
    })
    .sort((a, b) => {
      const at = new Date(a.listing.open_house?.startsAt || 0).getTime();
      const bt = new Date(b.listing.open_house?.startsAt || 0).getTime();
      return at - bt;
    });

  const openHouseJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Beverly Hills and 90210 Open Houses",
        description:
          "Upcoming agent-authorized open houses across Beverly Hills, ZIP code 90210, and nearby Westside neighborhoods.",
        url: "https://90210estate.com/open-houses",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: upcoming.map(({ listing }, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://90210estate.com/listings/${listing.slug}`,
            name: `Open house at ${listing.address}`,
          })),
        },
      },
      ...upcoming.map(({ listing }) => {
        const photo = listing.photos?.find((p) => p.primary) || listing.photos?.[0];
        return {
          "@type": "Event",
          name: `Open House: ${listing.address}`,
          startDate: listing.open_house?.startsAt,
          endDate: listing.open_house?.endsAt || listing.open_house?.startsAt,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          url: `https://90210estate.com/listings/${listing.slug}`,
          image: photo?.url ? [photo.url] : undefined,
          description:
            listing.open_house?.notes ||
            `Open house for ${listing.address}. Contact the named listing professional for property and showing details.`,
          location: {
            "@type": "Place",
            name: listing.address,
            address: {
              "@type": "PostalAddress",
              streetAddress: listing.street || undefined,
              addressLocality: listing.city || undefined,
              addressRegion: listing.state || "CA",
              postalCode: listing.zip || undefined,
              addressCountry: "US",
            },
          },
          organizer: listing.agent
            ? {
                "@type": "Person",
                name: listing.agent.display_name,
                url: `https://90210estate.com/agents/${listing.agent.slug}`,
              }
            : undefined,
        };
      }),
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(openHouseJsonLd) }}
      />
      <PageHero
        eyebrow="Plan a visit"
        title="Beverly Hills open houses."
        description="Every open house below comes straight from the listing agent's own workspace, with the date, time and property details they published."
      />
      <section className="content-section content-shell">
        {upcoming.length > 0 ? (
          <div className="market-listing-grid">
            {upcoming.map(({ listing, label }) => {
              const photo = listing.photos?.find((p) => p.primary) || listing.photos?.[0];
              return (
                <article className="market-listing-card" key={listing.id}>
                  <Link className="market-listing-photo" href={`/listings/${listing.slug}`}>
                    {photo?.url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cdnImage(photo.url, 760)} alt={photo.alt || listing.address} loading="lazy" decoding="async" />
                    ) : null}
                  </Link>
                  <div className="market-listing-copy">
                    <p className="eyebrow">{label}</p>
                    <p className="market-price">{formatPrice(listing.price, listing.purpose)}</p>
                    <h3><Link href={`/listings/${listing.slug}`}>{listing.address}</Link></h3>
                    <p className="market-specs">
                      {[listing.beds ? `${listing.beds} bd` : null,
                         listing.baths ? `${listing.baths} ba` : null,
                         listing.sqft ? `${listing.sqft.toLocaleString()} sq ft` : null]
                        .filter(Boolean).join(" · ")}
                    </p>
                    {listing.open_house?.notes ? <p className="market-specs">{listing.open_house.notes}</p> : null}
                    {listing.agent ? (
                      <p className="market-agent">
                        Hosted by <Link href={`/agents/${listing.agent.slug}`}>{listing.agent.display_name}</Link>
                        {listing.agent.brokerage ? ` · ${listing.agent.brokerage}` : ""}
                        {listing.agent.dre_license ? ` · DRE #${listing.agent.dre_license}` : ""}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="notice">
            No open houses are scheduled right now. Listing agents publish them from their own
            workspace, and each one appears here as soon as it is set.
          </div>
        )}

        <h2 style={{ marginTop: 55 }}>Representing an open house?</h2>
        <p className="lead">
          Add the date and time to your listing in GR CRM and it appears here automatically —
          with your name, brokerage and licence attached to the event.
        </p>
        <Link className="button navy" href="/for-realtors">Set up your workspace</Link>
      </section>
    </main>
  );
}
