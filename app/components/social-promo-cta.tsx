const promoEmail = process.env.NEXT_PUBLIC_SOCIAL_PROMO_EMAIL || "westccmortgage@gmail.com";

const promoSubject = "Feature my listing on 90210 Estate social media";

const promoBody = [
  "Hi,",
  "",
  "Please feature my listing on your social channels.",
  "",
  "Property address:",
  "Price:",
  "MLS #:",
  "Link to photos:",
  "",
  "My name:",
  "Brokerage / DRE #:",
  "Phone:",
  "",
  "Thank you.",
].join("\n");

const promoMailto = `mailto:${promoEmail}?subject=${encodeURIComponent(promoSubject)}&body=${encodeURIComponent(promoBody)}`;

// Agents send us the property and we post it for them — the address is filled in
// automatically so nobody has to look it up.
export function SocialPromoCta() {
  return (
    <div className="realtor-cta">
      <div>
        <p className="eyebrow">Free promotion</p>
        <h2>We post your listing on our social media.</h2>
        <p className="lead">
          Send us the property and we feature it across our Instagram, Facebook and LinkedIn accounts at no cost
          to local agents. The message opens with <strong>{promoEmail}</strong> already filled in —
          just add the address and hit send.
        </p>
      </div>
      <a className="button navy" href={promoMailto}>Email {promoEmail}</a>
    </div>
  );
}
