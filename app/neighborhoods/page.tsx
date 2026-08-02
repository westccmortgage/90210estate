import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/page-hero";

export const metadata: Metadata = { title: "Neighborhoods" };
const areas = [
  ["Beverly Hills Flats", "Beverly Hills", "Broad tree-lined streets and architecturally significant homes north of the city center."],
  ["Trousdale Estates", "Beverly Hills", "Mid-century architecture, privacy, and panoramic city views above Sunset Boulevard."],
  ["Beverly Hills Gateway", "Beverly Hills", "Estate properties near the northern entrance to the city and the surrounding hills."],
  ["Beverly Hills Post Office", "Los Angeles", "Hillside neighborhoods with Beverly Hills mailing addresses outside the city boundary."],
  ["Bel Air", "Westside", "Gated estates, canyon roads, and secluded residential settings west of Beverly Hills."],
  ["Holmby Hills", "Platinum Triangle", "Landmark estates, generous lots, and quiet avenues between Beverly Hills and Bel Air."],
  ["Sunset Strip", "West Hollywood Hills", "Contemporary view homes and quick access to dining, entertainment, and West Hollywood."],
  ["West Hollywood West", "West Hollywood", "Walkable residential streets near Beverly Hills, design districts, and neighborhood retail."],
  ["Century City", "Westside", "Luxury residences and high-rise living near major business, retail, and cultural destinations."],
];

export default function NeighborhoodsPage() {
  return <main><PageHero eyebrow="Local guide" title="Know the neighborhood before the showing." description="A practical starting point for comparing Beverly Hills, Bel Air, and nearby Westside neighborhoods—then continue into live, agent-authorized listings." /><section className="section shell"><div className="data-grid">{areas.map(([name, region, description]) => <article className="data-card" key={name}><p className="eyebrow">{region}</p><h3>{name}</h3><p>{description}</p><Link href={`/listings?area=${encodeURIComponent(name)}`}>Search {name} →</Link></article>)}</div><p className="notice" style={{ marginTop: 35 }}>Neighborhood descriptions are general orientation, not representations about school attendance, boundaries, commute times, or property conditions. Verify details independently.</p></section></main>;
}
