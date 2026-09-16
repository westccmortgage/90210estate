"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice, type MarketplaceListing } from "../lib/crm-marketplace";
import { cdnImage } from "../lib/image-cdn";

type Spot = { listing: MarketplaceListing; lat: number; lng: number };

// GR CRM stores each listing's point when it is published. Condos that share one
// address would sit on one pixel, so a group is fanned out around its point and
// every home stays hoverable and clickable.
function placed(listings: MarketplaceListing[]): Spot[] {
  const groups = new Map<string, MarketplaceListing[]>();
  for (const listing of listings) {
    if (!Number.isFinite(listing.lat) || !Number.isFinite(listing.lng)) continue;
    const key = `${Number(listing.lat).toFixed(5)},${Number(listing.lng).toFixed(5)}`;
    groups.set(key, [...(groups.get(key) || []), listing]);
  }

  const spots: Spot[] = [];
  // Map iteration without downlevelIteration: these sites compile to ES5.
  groups.forEach((group) => {
    group.forEach((listing, index) => {
      const angle = (2 * Math.PI * index) / group.length;
      const spread = group.length > 1;
      spots.push({
        listing,
        lat: Number(listing.lat) + (spread ? 0.00035 * Math.cos(angle) : 0),
        lng: Number(listing.lng) + (spread ? 0.00042 * Math.sin(angle) : 0),
      });
    });
  });
  return spots;
}

// Built from elements, not an HTML string: addresses and photo links are typed by
// agents in the CRM and must never be read as markup.
function cardElement(listing: MarketplaceListing) {
  const span = (className: string, text: string) => {
    const element = document.createElement("span");
    element.className = className;
    element.textContent = text;
    return element;
  };

  const card = document.createElement("a");
  card.className = "map-card";
  card.href = `/listings/${encodeURIComponent(listing.slug)}`;

  const photo = listing.photos?.find((item) => item.primary)?.url || listing.photos?.[0]?.url;
  if (photo) {
    const image = document.createElement("img");
    image.className = "map-card-photo";
    image.src = cdnImage(photo, 480) || photo;
    image.alt = "";
    image.loading = "lazy";
    card.append(image);
  }

  const body = span("map-card-body", "");
  body.append(span("map-card-price", formatPrice(listing.price, listing.purpose)));
  body.append(span("map-card-addr", listing.street ? [listing.street, listing.city].filter(Boolean).join(", ") : listing.address));
  const specs = span("map-card-specs", "");
  [
    listing.beds ? `${listing.beds} bd` : null,
    listing.baths ? `${listing.baths} ba` : null,
    listing.sqft ? `${Number(listing.sqft).toLocaleString("en-US")} sq ft` : null,
    !listing.beds && !listing.sqft ? listing.property_type : null,
  ].forEach((item) => { if (item) specs.append(span("", item)); });
  body.append(specs);
  card.append(body);
  return card;
}

export function ListingsMap({ listings }: { listings: MarketplaceListing[] }) {
  const holder = useRef<HTMLDivElement>(null);
  const spots = useMemo(() => placed(listings), [listings]);

  useEffect(() => {
    if (!holder.current || !spots.length) return;
    let cancelled = false;
    let instance: LeafletMap | null = null;

    // Leaflet measures its container, so the map is built once it is on screen.
    import("leaflet").then((L) => {
      if (cancelled || !holder.current) return;
      instance = L.map(holder.current, { scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(instance);

      // The card stays open while the pointer is on the dot or on the card, and
      // closes a moment after it leaves both, so there is time to reach it.
      // On a phone the card opens from a tap, so the map may move to show all of it;
      // with a mouse it must stay still, or hovering would drag the map around.
      const touch = window.matchMedia("(hover: none)").matches;
      // With a mouse the map never moves, so a card that would spill over an edge of
      // the map opens below its dot, or slides sideways, instead of being cut off.
      const keepInside = (element: HTMLElement) => {
        element.style.marginBottom = "";
        element.style.marginLeft = "";
        if (!holder.current) return;
        const frame = holder.current.getBoundingClientRect();
        const card = element.getBoundingClientRect();
        if (card.top < frame.top + 8) element.style.marginBottom = `${-(card.height + 22)}px`;
        if (card.left < frame.left + 8) element.style.marginLeft = `${frame.left + 8 - card.left}px`;
        else if (card.right > frame.right - 8) element.style.marginLeft = `${frame.right - 8 - card.right}px`;
      };
      let closeTimer: number | undefined;
      let openedAt = 0;
      const cancelClose = () => window.clearTimeout(closeTimer);
      const closeSoon = (marker: Marker) => {
        cancelClose();
        closeTimer = window.setTimeout(() => marker.closePopup(), 350);
      };

      spots.forEach(({ listing, lat, lng }) => {
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({ className: "map-pin-wrap", html: '<span class="map-dot"></span>', iconSize: undefined }),
          riseOnHover: true,
          keyboard: true,
          title: listing.address,
        });

        marker.bindPopup(cardElement(listing), {
          className: "map-card-popup",
          closeButton: false,
          autoPan: touch,
          autoPanPadding: [16, 16],
          offset: [0, -4],
          minWidth: 232,
          maxWidth: 232,
        });

        marker.on("mouseover", () => {
          cancelClose();
          if (!marker.isPopupOpen()) {
            marker.openPopup();
            openedAt = Date.now();
          }
        });
        marker.on("mouseout", () => closeSoon(marker));
        marker.on("popupopen", (event) => {
          const element = event.popup.getElement();
          if (!element) return;
          if (!touch) keepInside(element);
          if (element.dataset.hover) return; // the popup element is reused on every open
          element.dataset.hover = "1";
          element.addEventListener("mouseenter", cancelClose);
          element.addEventListener("mouseleave", () => closeSoon(marker));
        });
        // Mouse: the card is already open from hovering, so a click opens the
        // listing. Touch: the first tap shows the card; tapping the card opens it.
        marker.on("click", () => {
          if (marker.isPopupOpen() && Date.now() - openedAt > 400) {
            window.location.href = `/listings/${encodeURIComponent(listing.slug)}`;
          } else {
            marker.openPopup();
            openedAt = Date.now();
          }
        });

        marker.addTo(instance!);
      });

      instance.fitBounds(spots.map((spot) => [spot.lat, spot.lng]) as [number, number][], { padding: [50, 50], maxZoom: 15 });
    });

    return () => {
      cancelled = true;
      instance?.remove();
    };
  }, [spots]);

  if (!spots.length) {
    return <div className="listings-map listings-map-empty">These homes are not on the map yet.</div>;
  }
  return <div className="listings-map" ref={holder} />;
}
