import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/page-hero";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <main><PageHero eyebrow="About 90210 Estate" title="A focused marketplace, not a brokerage’s walled garden." description="The site brings together homes and professionals across Beverly Hills and the Westside while preserving the identity of every listing agent." /><section className="content-section content-shell"><h2>The idea is simple.</h2><p className="lead">Buyers should have a focused local place to discover homes and understand neighborhoods. Listing agents should have another way to reach them without losing credit for the listing or control of the relationship.</p><ul className="simple-list"><li><strong>Independent presentation</strong><span>90210 Estate is positioned as a local real estate marketing platform, not as the inventory page of one brokerage.</span></li><li><strong>Permission first</strong><span>Listings, photos, and agent information are added only after submission or authorization.</span></li><li><strong>Clear roles</strong><span>The listing agent remains visible. Mortgage help is optional and provided separately by a licensed mortgage company.</span></li><li><strong>Local focus</strong><span>The editorial footprint covers Beverly Hills, Beverly Hills Post Office, Trousdale Estates, Bel Air, Holmby Hills, and the Sunset Strip.</span></li></ul><div className="inline-actions"><Link className="button navy" href="/listings">Explore homes</Link><Link className="button outline" href="/for-realtors">Join as a local agent</Link></div></section></main>;
}
