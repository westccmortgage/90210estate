import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/page-hero";
import { PaymentCalculator } from "../components/payment-calculator";

const mortgageSite = "https://westcoastcapitalmortgage.com";
const referral = "utm_source=90210estate&utm_medium=referral&utm_campaign=beverly_hills_financing";

export const metadata: Metadata = {
  title: "Beverly Hills & 90210 Home Financing",
  description:
    "Plan financing for a Beverly Hills or 90210 home purchase, including jumbo, self-employed, condo, second-home, and investment-property scenarios.",
  alternates: { canonical: "/financing" },
  openGraph: {
    title: "Beverly Hills & 90210 Home Financing | 90210 Estate",
    description:
      "Estimate a payment, understand common high-value purchase considerations, and connect separately with a licensed mortgage professional.",
    url: "/financing",
    type: "website",
  },
};

const financingSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Beverly Hills and 90210 Home Financing",
  description:
    "Educational home-financing guidance and a payment estimator for Beverly Hills and 90210 home buyers.",
  url: "https://90210estate.com/financing",
  about: [
    { "@type": "Thing", name: "Beverly Hills home financing" },
    { "@type": "Thing", name: "Jumbo mortgage loans" },
    { "@type": "Place", name: "Beverly Hills, California" },
  ],
  mainEntity: {
    "@type": "Service",
    name: "Home purchase financing consultation",
    serviceType: "Mortgage financing consultation",
    areaServed: {
      "@type": "City",
      name: "Beverly Hills",
      containedInPlace: { "@type": "State", name: "California" },
    },
    provider: {
      "@type": "FinancialService",
      name: "West Coast Capital Mortgage Inc.",
      url: mortgageSite,
      telephone: "+1-310-654-1577",
      address: {
        "@type": "PostalAddress",
        streetAddress: "150 E Olive Ave, Unit 112",
        addressLocality: "Burbank",
        addressRegion: "CA",
        postalCode: "91502",
        addressCountry: "US",
      },
      identifier: [
        { "@type": "PropertyValue", propertyID: "NMLS", value: "2817729" },
        {
          "@type": "PropertyValue",
          propertyID: "CA DRE Corporation License",
          value: "02440065",
        },
      ],
    },
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does every 90210 home purchase require a jumbo loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The loan category depends on the requested loan amount, current county loan limits, occupancy, property type, and the selected program—not the ZIP code or purchase price alone.",
      },
    },
    {
      "@type": "Question",
      name: "Can a self-employed buyer finance a Beverly Hills home?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Potentially. A licensed mortgage professional can compare full-documentation and eligible alternative-documentation programs after reviewing the buyer's income, assets, credit, down payment, and property.",
      },
    },
    {
      "@type": "Question",
      name: "When should a buyer arrange mortgage preapproval?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Before writing an offer. Early review leaves time to verify documentation, liquidity, reserves, appraisal expectations, insurance, and any condo or property-specific requirements.",
      },
    },
  ],
};

export default function FinancingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHero
        eyebrow="Beverly Hills & 90210 financing"
        title="Plan the financing before the offer."
        description="Estimate the payment, identify the questions that matter for a high-value purchase, and connect separately with a licensed mortgage professional—without changing your relationship with the listing agent."
      />

      <section className="section shell split intro">
        <div>
          <p className="eyebrow">Before you compete for the home</p>
          <h2>A 90210 purchase may need more than a quick preapproval.</h2>
        </div>
        <div className="body-copy">
          <p>
            Beverly Hills and surrounding Westside purchases can involve jumbo loan
            amounts, complex income, substantial reserves, appraisal questions,
            insurance review, or condominium-project requirements. The right starting
            point is a financing plan built around the actual buyer and property—not a
            generic maximum price.
          </p>
          <p>
            90210 Estate keeps the roles clear: property and showing questions stay
            with the named real estate professional. Mortgage services are optional
            and provided separately by West Coast Capital Mortgage Inc.
          </p>
          <div className="inline-actions">
            <Link className="text-link" href="/90210-homes-for-sale">
              Search 90210 homes <span>→</span>
            </Link>
            <Link className="text-link" href="/neighborhoods">
              Compare neighborhoods <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="content-shell">
          <p className="eyebrow">Payment planning</p>
          <h2>Estimate the monthly payment.</h2>
          <p className="lead">
            Adjust the home price, down payment, interest rate, and term. The result is
            educational only and is not a rate quote, approval, or rate lock.
          </p>
          <PaymentCalculator />
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <p className="eyebrow">Common purchase scenarios</p>
          <h2>Start with the structure that fits the buyer.</h2>
        </div>
        <div className="data-grid">
          <article className="data-card">
            <p className="eyebrow">Higher loan amounts</p>
            <h3>Jumbo and high-balance</h3>
            <p>
              Review down payment, reserves, income documentation, occupancy, and
              appraisal expectations before assuming one loan structure fits every
              high-value property.
            </p>
            <a
              href={`${mortgageSite}/jumbo-loans?${referral}`}
              target="_blank"
              rel="noreferrer"
            >
              Explore jumbo financing ↗
            </a>
          </article>
          <article className="data-card">
            <p className="eyebrow">Business owners</p>
            <h3>Self-employed income</h3>
            <p>
              Compare standard documentation with eligible alternative-documentation
              programs when tax returns do not tell the full story of the business or
              household cash flow.
            </p>
            <a
              href={`${mortgageSite}/bank-statement-loans?${referral}`}
              target="_blank"
              rel="noreferrer"
            >
              Review bank-statement loans ↗
            </a>
          </article>
          <article className="data-card">
            <p className="eyebrow">Property and occupancy</p>
            <h3>Condos, second homes, and investments</h3>
            <p>
              The property, HOA, insurance, intended occupancy, rental use, and title
              structure can change the available financing and the documents needed.
            </p>
            <a href={`${mortgageSite}/buy?${referral}`} target="_blank" rel="noreferrer">
              Review purchase financing ↗
            </a>
          </article>
        </div>
      </section>

      <section className="section soft">
        <div className="content-shell">
          <p className="eyebrow">A stronger offer starts earlier</p>
          <h2>Review the whole scenario, not only the rate.</h2>
          <ul className="simple-list">
            <li>
              <strong>Purchase target</strong>
              <span>Define the likely price range, down payment, occupancy, property type, and closing timeline.</span>
            </li>
            <li>
              <strong>Borrower profile</strong>
              <span>Organize income, assets, credit, liabilities, liquidity, and reserve requirements before an offer deadline.</span>
            </li>
            <li>
              <strong>Program comparison</strong>
              <span>Compare eligible structures and trade-offs instead of assuming the smallest advertised rate is the best fit.</span>
            </li>
            <li>
              <strong>Property review</strong>
              <span>Recheck appraisal, insurance, condo, condition, and title issues once the specific home is selected.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <p className="eyebrow">Beverly Hills financing questions</p>
          <h2>What buyers often ask before an offer.</h2>
        </div>
        <div className="finance-faq">
          <details>
            <summary>Does every 90210 home purchase require a jumbo loan?</summary>
            <p>
              No. The loan category depends on the requested loan amount, current
              county limits, occupancy, property type, and program—not the ZIP code or
              purchase price alone.
            </p>
          </details>
          <details>
            <summary>Can a self-employed buyer finance a Beverly Hills home?</summary>
            <p>
              Potentially. A licensed mortgage professional can compare
              full-documentation and eligible alternative-documentation programs after
              reviewing the buyer’s income, assets, credit, down payment, and property.
            </p>
          </details>
          <details>
            <summary>When should a buyer arrange mortgage preapproval?</summary>
            <p>
              Before writing an offer. Early review leaves time to verify documentation,
              liquidity, reserves, appraisal expectations, insurance, and any condo or
              property-specific requirements.
            </p>
          </details>
          <details>
            <summary>Does the calculator include every ownership cost?</summary>
            <p>
              No. It uses general assumptions for property tax and insurance and does
              not include HOA dues, mortgage insurance, special assessments, utilities,
              maintenance, or other property-specific costs.
            </p>
          </details>
        </div>
      </section>

      <section className="section midnight">
        <div className="shell finance-band">
          <div>
            <p className="eyebrow gold-text">West Coast Capital Mortgage</p>
            <h2>Ready for a property-specific financing review?</h2>
            <p>
              Speak with a licensed mortgage professional or continue through the
              company’s secure application process. Mortgage services remain separate
              from the listing agent and 90210 Estate marketplace.
            </p>
          </div>
          <div className="finance-actions">
            <a
              className="button gold"
              href={`${mortgageSite}/buy?${referral}`}
              target="_blank"
              rel="noreferrer"
            >
              Review purchase options ↗
            </a>
            <a
              className="button glass"
              href={`${mortgageSite}/apply?${referral}`}
              target="_blank"
              rel="noreferrer"
            >
              Start securely ↗
            </a>
          </div>
        </div>
      </section>

      <section className="content-section content-shell">
        <div className="notice mortgage-disclosure">
          <strong>Mortgage services provided by West Coast Capital Mortgage Inc.</strong>
          <span>150 E Olive Ave, Unit 112, Burbank, CA 91502</span>
          <a href="tel:+13106541577">(310) 654-1577</a>
          <span>Company NMLS #2817729 · CA DRE Corporation License #02440065</span>
          <span>Anatoliy Kanevsky · NMLS #2775380 · California Real Estate Broker DRE #01385024</span>
          <span>Equal Housing Opportunity</span>
          <span>
            Educational information only; not a commitment to lend. All loans are
            subject to credit, income, asset, property, program, and underwriting
            requirements.
          </span>
        </div>
      </section>
    </main>
  );
}
