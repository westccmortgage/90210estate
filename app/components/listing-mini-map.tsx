"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

// A quiet locator map: no dragging, no zoom, just where the home sits. The point
// comes from GR CRM; a listing without one simply shows no map.
export function ListingMiniMap({ lat, lng, area }: { lat?: number | null; lng?: number | null; area: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const located = Number.isFinite(lat) && Number.isFinite(lng);

  useEffect(() => {
    if (!located || !holder.current) return;
    let cancelled = false;
    let instance: LeafletMap | null = null;

    import("leaflet").then((L) => {
      if (cancelled || !holder.current) return;
      instance = L.map(holder.current, {
        scrollWheelZoom: false, zoomControl: false, dragging: false, doubleClickZoom: false, keyboard: false,
      }).setView([Number(lat), Number(lng)], 14);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap", maxZoom: 19,
      }).addTo(instance);
      L.marker([Number(lat), Number(lng)], {
        icon: L.divIcon({ className: "map-pin-wrap", html: '<span class="map-dot"></span>', iconSize: undefined }),
        interactive: false,
      }).addTo(instance);
    });

    return () => {
      cancelled = true;
      instance?.remove();
    };
  }, [located, lat, lng]);

  if (!located) return null;

  return (
    <div className="mini-map-wrap">
      <div className="mini-map-head">
        <p>{area}</p>
        <a href="/listings?view=map">See all listings on the map →</a>
      </div>
      <div className="mini-map" ref={holder} />
    </div>
  );
}
