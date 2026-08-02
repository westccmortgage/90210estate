import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";

export const metadata: Metadata = { title: "Market Reports" };

export default function MarketPage() {
  return <main><PageHero eyebrow="Local market" title="Useful signals, without the noise." description="New listings, meaningful price changes, returning inventory, and open-house activity across Beverly Hills and the Westside." /><section className="content-section content-shell"><h2>The local report is in preparation.</h2><p className="lead">We will publish market information only when it can be sourced, dated, and clearly explained. The launch edition will focus on inventory movement—not predictions or unsupported claims.</p><ul className="simple-list"><li><strong>New inventory</strong><span>Homes newly placed on the market, organized by area and price range.</span></li><li><strong>Price changes</strong><span>Meaningful reductions and repositioned listings worth a second look.</span></li><li><strong>Back on market</strong><span>Properties returning to active status, with a link to the authorized listing source.</span></li><li><strong>Open-house watch</strong><span>Confirmed public events submitted by local listing agents.</span></li></ul><a className="button navy" href="mailto:info@westccrealty.com?subject=90210%20Estate%20market%20report">Request the first report</a></section></main>;
}
