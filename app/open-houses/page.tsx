import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/page-hero";
import { formatPrice, getMarketplaceListings } from "../lib/crm-marketplace";

// Open-house times come from the listing agent's CRM and change often, so this
// page always reads the live feed instead of serving a build-time snapshot.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = { title: "Open Houses" };

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

  return (
    <main>
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
                      <img src={photo.url} alt={photo.alt || listing.address} loading="lazy" />
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
