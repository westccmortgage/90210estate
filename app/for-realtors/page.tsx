import type { Metadata } from "next";
import { ListingSubmission } from "../components/listing-submission";
import { SocialPromoCta } from "../components/social-promo-cta";
import { PageHero } from "../components/page-hero";
import { grcrmLoginUrl } from "../lib/crm-marketplace";

export const metadata: Metadata = {
  title: "For Local Realtors",
  description: "A free local profile, listing promotion, and private GR CRM workspace for Beverly Hills and Westside real estate professionals.",
};

export default function RealtorsPage() {
  return (
    <main>
      <PageHero
        eyebrow="For local Realtors"
        title="Your local profile, listings, and CRM—in one private workspace."
        description="90210 Estate gives local agents another professional place to present properties. GR CRM provides the private admin area behind it, while every client relationship and listing remains yours."
      />
      <section className="content-section content-shell">
        <h2>What each agent receives.</h2>
        <ul className="simple-list">
          <li><strong>Private workspace</strong><span>Your contacts, listings, campaigns, tasks, and team members are isolated from WCCM and every other agent workspace.</span></li>
          <li><strong>Easy listing control</strong><span>Add photos and property details once, then publish, update, or remove the listing from 90210 Estate.</span></li>
          <li><strong>Personal agent page</strong><span>A dedicated public profile with your name, brokerage, DRE license, bio, contact details, and active listings.</span></li>
          <li><strong>Email CRM</strong><span>Import your own contact list and prepare listing, open-house, market-update, and follow-up campaigns from GR CRM.</span></li>
          <li><strong>Direct attribution</strong><span>Your role stays clear. Property inquiries identify the listing and the professional representing it.</span></li>
          <li><strong>No launch fee</strong><span>Founding local partners can use the marketplace and core CRM workspace at no charge, subject to the published program terms.</span></li>
        </ul>

        <div className="notice">
          GR CRM is the secure administration area, not a shared lead database. Other agents and the 90210 Estate public site cannot access an agent&apos;s contact list or campaign audience. Only profile and listing fields intentionally published by the agent are copied to the public marketplace.
        </div>

        <div className="realtor-cta">
          <div>
            <p className="eyebrow">Agent administration</p>
            <h2>Start your private workspace.</h2>
            <p className="lead">Create your account, complete the public profile, add a listing, and choose Publish to 90210 Estate when it is ready.</p>
          </div>
          <a className="button navy" href={grcrmLoginUrl}>Create or open workspace</a>
        </div>

        <h2 style={{ marginTop: 70 }}>Prefer a manual submission?</h2>
        <p className="lead">Use this launch form and we will review the listing with you. Nothing is published until authorization and agent identity are confirmed.</p>
        <SocialPromoCta />

        <ListingSubmission />
      </section>
    </main>
  );
}
