const promoEmail = process.env.NEXT_PUBLIC_SOCIAL_PROMO_EMAIL || "westccmortgage@gmail.com";

const promoSubject = "Please post my listing — 90210 Estate social media";

// Everything needed to build the post, in the order it gets used. Agents with a
// GR CRM workspace can send the same brief in one click from the listing page.
const promoBody = [
  "Hi,",
  "",
  "Please feature my listing on your social channels.",
  "",
  "PROPERTY",
  "Address:",
  "Price:",
  "For (sale / rent):",
  "Status (coming soon / active / pending):",
  "Type (single family / condo / townhouse):",
  "Beds / baths / sq ft:",
  "MLS #:",
  "",
  "DESCRIPTION (what should the caption say)",
  "",
  "",
  "OPEN HOUSE (day and time, if any)",
  "",
  "",
  "PHOTOS AND VIDEO",
  "Paste links, or attach the files to this email:",
  "",
  "",
  "LISTING AGENT (this attribution goes on the post)",
  "Name:",
  "Brokerage:",
  "DRE #:",
  "Phone:",
  "Email:",
  "Instagram handle to tag:",
  "",
  "Thank you.",
].join("\n");

const promoMailto = `mailto:${promoEmail}?subject=${encodeURIComponent(promoSubject)}&body=${encodeURIComponent(promoBody)}`;

// Agents send us the property and we post it for them. The email opens already
// addressed and laid out, so nothing needed for the post gets left behind.
export function SocialPromoCta() {
  return (
    <div className="realtor-cta">
      <div>
        <p className="eyebrow">Free promotion</p>
        <h2>We post your listing on our social media.</h2>
        <p className="lead">
          Send us the property and we feature it across our Instagram, Facebook and LinkedIn
          accounts at no cost to local agents. The message opens addressed to{" "}
          <strong>{promoEmail}</strong> with every field we need already laid out — fill it in
          and send. Agents with a GR CRM workspace can send the same brief in one click from
          the listing itself.
        </p>
      </div>
      <a className="button navy" href={promoMailto}>Email {promoEmail}</a>
    </div>
  );
}
