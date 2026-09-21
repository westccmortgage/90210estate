import Link from "next/link";
import { getMarketplaceListings, type MarketplaceListing } from "../lib/crm-marketplace";
import { cdnImage } from "../lib/image-cdn";

// Real homes on the home page, straight after the hero: the owner's review was
// that the introduction ran too long and it was not clear where the listings
// were. Same card markup as /listings, so it inherits that page's styles.

const HOME_COUNT = 6;

function priceLabel(listing: MarketplaceListing) {
  if (listing.price == null) return "Price on request";
  const value = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.price);
  return listing.purpose === "Rent" ? `${value}/mo` : value;
}

// Houses first: a land parcel's aerial of bare dirt is a poor first impression.
function rank(listing: MarketplaceListing) {
  const type = (listing.property_type || "").toLowerCase();
  const status = (listing.status || "").toLowerCase();
  let score = 0;
  if (type.includes("land") || (!listing.beds && !listing.sqft)) score += 2;
  if (status.includes("sold") || status.includes("closed")) score += 4;
  else if (status.includes("pending") || status.includes("contract")) score += 1;
  return score;
}

export async function HomeListings() {
  const all = await getMarketplaceListings();
  const picked = all
    .map((listing, i) => ({ listing, i }))
    .filter(({ listing }) => (listing.photos?.length ?? 0) > 0)
    .sort((a, b) => rank(a.listing) - rank(b.listing) || a.i - b.i)
    .slice(0, HOME_COUNT)
    .map(({ listing }) => listing);

  if (!picked.length) return null;

  return (
    <section className="section shell home-listings" id="homes" aria-labelledby="home-listings-title">
      <div className="section-heading row-heading">
        <div>
          <p className="eyebrow">Homes for sale</p>
          <h2 id="home-listings-title">On the market now.</h2>
        </div>
        <Link className="button navy" href="/listings">View all {all.length} homes</Link>
      </div>
      <div className="market-listing-grid">
        {picked.map((listing, index) => {
          const photo = listing.photos?.find((item) => item.primary)?.url || listing.photos?.[0]?.url;
          return (
            <article className="market-listing-card" key={listing.id}>
              <Link className="market-listing-photo" href={`/listings/${listing.slug}`}>
                {photo ? (
                  <img src={cdnImage(photo, 760)} alt={listing.photos?.[0]?.alt || listing.address} loading={index < 3 ? "eager" : "lazy"} decoding="async" />
                ) : (
                  <span>Photo coming soon</span>
                )}
                {listing.status && <small>{listing.status}</small>}
              </Link>
              <div className="market-listing-copy">
                <p className="market-price">{priceLabel(listing)}</p>
                <h3><Link href={`/listings/${listing.slug}`}>{listing.address}</Link></h3>
                <p className="market-specs">
                  {listing.beds ? <span>{listing.beds} beds</span> : null}
                  {listing.baths ? <span>{listing.baths} baths</span> : null}
                  {listing.sqft ? <span>{Number(listing.sqft).toLocaleString()} sq ft</span> : null}
                  {!listing.beds && !listing.sqft && listing.property_type ? <span>{listing.property_type}</span> : null}
                </p>
                {listing.agent && (
                  <p className="market-agent">
                    Listed by <Link href={`/agents/${listing.agent.slug}`}>{listing.agent.display_name}</Link>
                    {listing.agent.brokerage ? ` · ${listing.agent.brokerage}` : ""}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
