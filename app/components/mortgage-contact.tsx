// West Coast Capital Mortgage under the listing agent's card: who to talk to about
// financing this home, and a button to the pre-approval request form. The form
// records utm_source/utm_content, so each request shows the site and the home.

const MORTGAGE_FORM = "https://westcoastcapitalmortgage.com/apply";
const PHONE = "(310) 654-1577";
const EMAIL = "westccmortgage@gmail.com";
const OFFICER_PHOTO = "/media/anatoliy-kanevsky-480.webp";

function formUrl(source: string, address: string) {
  const query = new URLSearchParams({
    utm_source: source,
    utm_medium: "listing",
    utm_campaign: "pre-approval",
    utm_content: address,
  });
  return `${MORTGAGE_FORM}?${query.toString()}#apply-form`;
}

export function MortgageContact({ address, purpose, source }: { address: string; purpose?: string | null; source: string }) {
  const rental = (purpose || "").toLowerCase() === "rent";
  return (
    <aside className="wccm-card">
      <p className="eyebrow">{rental ? "Thinking of buying?" : "Financing this home"}</p>
      <div className="wccm-officer">
        <span className="wccm-face"><img src={OFFICER_PHOTO} alt="Anatoliy Kanevsky" loading="lazy" /></span>
        <div>
          <strong>Anatoliy Kanevsky</strong>
          <span>Mortgage broker · NMLS #2775380</span>
          <span>West Coast Capital Mortgage</span>
        </div>
      </div>
      <ul className="agent-contact-lines">
        <li><a href="tel:+13106541577">{PHONE}</a></li>
        <li><a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Pre-approval: ${address}`)}`}>{EMAIL}</a></li>
      </ul>
      <a className="button gold wccm-button" href={formUrl(source, address)}>Get pre-approved</a>
      <p className="wccm-legal">West Coast Capital Mortgage Inc. · NMLS #2817729 · CA DRE #02440065 · Equal Housing Opportunity</p>
    </aside>
  );
}
