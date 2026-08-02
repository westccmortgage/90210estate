import type { Metadata } from "next";
import { PageHero } from "../components/page-hero";
import { PaymentCalculator } from "../components/payment-calculator";

export const metadata: Metadata = { title: "Mortgage Center" };

export default function FinancingPage() {
  return <main><PageHero eyebrow="Mortgage center" title="Put the home and payment in the same conversation." description="Use the estimate below to frame the question, then speak directly with West Coast Capital Mortgage about your actual scenario." /><section className="content-section content-shell"><h2>Estimate the monthly payment.</h2><p className="lead">Adjust the home price, down payment, interest rate, and term. This calculator is educational and does not quote or lock a rate.</p><PaymentCalculator /><div className="notice" style={{ marginTop: 35 }}>Mortgage services are provided separately by West Coast Capital Mortgage Inc., NMLS #2817729. Anatoliy Kanevsky, NMLS #2775380, CA DRE Broker #01385024. Equal Housing Opportunity. All loans are subject to underwriting, credit, income, property, and program requirements.</div></section></main>;
}

