"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import type { MarketplaceListing } from "../lib/crm-marketplace";

function priceLabel(listing: MarketplaceListing) {
  if (listing.price == null) return "Price on request";
  const value = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.price);
  return listing.purpose === "Rent" ? `${value}/mo` : value;
}

function Explorer({ listings }: { listings: MarketplaceListing[] }) {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? params.get("area") ?? "");
  const [price, setPrice] = useState("any");
  const [beds, setBeds] = useState("any");
  const [propertyType, setPropertyType] = useState("any");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return listings.filter((listing) => {
      const haystack = [listing.address, listing.city, listing.state, listing.zip].filter(Boolean).join(" ").toLowerCase();
      if (term && !haystack.includes(term)) return false;
      if (beds !== "any" && Number(listing.beds || 0) < Number(beds)) return false;
      if (propertyType !== "any" && (listing.property_type || "").toLowerCase() !== propertyType) return false;
      const amount = Number(listing.price || 0);
      if (price === "under-1500" && amount >= 1500000) return false;
      if (price === "1500-3000" && (amount < 1500000 || amount > 3000000)) return false;
      if (price === "3000-5000" && (amount < 3000000 || amount > 5000000)) return false;
      if (price === "over-5000" && amount < 5000000) return false;
      return true;
    });
  }, [beds, listings, price, propertyType, search]);

  return (
    <div>
      <div className="filter-bar" aria-label="Listing filters">
        <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search location" placeholder="City, neighborhood, or address" />
        <select aria-label="Price" value={price} onChange={(event) => setPrice(event.target.value)}>
          <option value="any">Any price</option>
          <option value="under-1500">Under $1.5M</option>
          <option value="1500-3000">$1.5M–$3M</option>
          <option value="3000-5000">$3M–$5M</option>
          <option value="over-5000">$5M+</option>
        </select>
        <select aria-label="Bedrooms" value={beds} onChange={(event) => setBeds(event.target.value)}>
          <option value="any">Any beds</option>
          <option value="2">2+ beds</option>
          <option value="3">3+ beds</option>
          <option value="4">4+ beds</option>
          <option value="5">5+ beds</option>
        </select>
        <select aria-label="Property type" value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
          <option value="any">All property types</option>
          <option value="single family">Single family</option>
          <option value="condo">Condo</option>
          <option value="townhouse">Townhouse</option>
          <option value="land">Land</option>
        </select>
        <button className="button navy" type="button">Search</button>
      </div>

      {filtered.length ? (
        <div className="market-listing-grid">
          {filtered.map((listing) => {
            const photo = listing.photos?.find((item) => item.primary)?.url || listing.photos?.[0]?.url;
            return (
              <article className="market-listing-card" key={listing.id}>
                <Link className="market-listing-photo" href={`/listings/${listing.slug}`}>
                  {photo ? <img src={photo} alt={listing.photos?.[0]?.alt || listing.address} /> : <span>Photo coming soon</span>}
                  {listing.status && <small>{listing.status}</small>}
                </Link>
                <div className="market-listing-copy">
                  <p className="market-price">{priceLabel(listing)}</p>
                  <h2><Link href={`/listings/${listing.slug}`}>{listing.address}</Link></h2>
                  <p className="market-specs">
                    {listing.beds != null && <span>{listing.beds} beds</span>}
                    {listing.baths != null && <span>{listing.baths} baths</span>}
                    {listing.sqft != null && <span>{Number(listing.sqft).toLocaleString()} sq ft</span>}
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
      ) : (
        <div className="empty-state">
          <p className="eyebrow">Verified marketplace</p>
          <h2>{search ? `No approved listings yet for “${search}.”` : "The first verified listings are being added."}</h2>
          <p>Only properties intentionally published by an authorized local agent appear here. Local agents can manage listings and promotion from their private GR CRM workspace.</p>
          <a className="button navy" href="/for-realtors">Create an agent workspace</a>
        </div>
      )}
    </div>
  );
}

export function ListingExplorer({ listings }: { listings: MarketplaceListing[] }) {
  return (
    <Suspense fallback={<div className="empty-state">Loading local search…</div>}>
      <Explorer listings={listings} />
    </Suspense>
  );
}

