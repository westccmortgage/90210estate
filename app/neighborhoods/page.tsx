import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/page-hero";
import { neighborhoods } from "../lib/neighborhoods";

export const metadata: Metadata = {
  title: "Beverly Hills & Westside Neighborhoods",
  description: "Explore Beverly Hills, Trousdale Estates, Bel Air, Holmby Hills, Beverly Hills Post Office, Century City, and nearby Westside real estate guides.",
  alternates: { canonical: "/neighborhoods" },
};

export default function NeighborhoodsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Local guide"
        title="Know the neighborhood before the showing."
        description="A practical starting point for comparing Beverly Hills, Bel Air, Holmby Hills, and nearby Westside neighborhoods—then continue into live, agent-authorized listings."
      />
      <section className="section shell">
        <div className="data-grid">
          {neighborhoods.map((area) => (
            <article className="data-card" key={area.slug}>
              <p className="eyebrow">{area.region}</p>
              <h3>{area.name}</h3>
              <p>{area.description}</p>
              <Link href={`/neighborhoods/${area.slug}`}>Explore {area.name} →</Link>
            </article>
          ))}
        </div>
        <p className="notice" style={{ marginTop: 35 }}>
          Neighborhood descriptions are general orientation, not representations about school attendance, boundaries, commute times, property conditions, or future value. Verify material details independently.
        </p>
      </section>
    </main>
  );
}
