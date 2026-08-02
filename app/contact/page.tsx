import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <main><PageHero eyebrow="Contact" title="Tell us what you’re looking for." description="Ask about a neighborhood, submit a property, or connect with the mortgage team for a financing question." /><section className="content-section content-shell"><div className="data-grid"><article className="data-card"><p className="eyebrow">General</p><h3>90210 Estate</h3><p>Marketplace questions, listing updates, and local information.</p><a href="mailto:info@westccrealty.com">info@westccrealty.com →</a></article><article className="data-card"><p className="eyebrow">Call</p><h3>(310) 654-1577</h3><p>Speak with Anatoliy Kanevsky about the site or a financing scenario.</p><a href="tel:+13106541577">Call now →</a></article><article className="data-card"><p className="eyebrow">Mortgage</p><h3>West Coast Capital Mortgage</h3><p>Pre-approval and loan scenario questions are handled separately.</p><a href="https://westccmortgage.com" target="_blank" rel="noreferrer">Visit mortgage website ↗</a></article></div><div className="notice" style={{ marginTop: 38 }}>Do not send Social Security numbers, bank statements, tax returns, or other sensitive financial documents by email. Use the mortgage company’s secure process when requested.</div></section></main>;
}
