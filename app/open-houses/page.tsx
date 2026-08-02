import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/page-hero";

export const metadata: Metadata = { title: "Open Houses" };

export default function OpenHousesPage() {
  return <main><PageHero eyebrow="Plan a visit" title="Beverly Hills open houses." description="A focused weekly view of agent-submitted open houses across Beverly Hills, Bel Air, and nearby Westside neighborhoods." /><section className="content-section content-shell"><div className="notice">The first verified open houses are being scheduled for publication. Dates and times will be shown only after confirmation with the listing agent.</div><h2 style={{ marginTop: 55 }}>Representing an open house?</h2><p className="lead">Send the property, date, time, and public listing link. Your name and contact information remain attached to the event.</p><Link className="button navy" href="/for-realtors">Submit an open house</Link></section></main>;
}
