import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <p className="footer-logo">90210 <span>Estate</span></p>
          <p>An independent local showcase for Beverly Hills homes, neighborhoods, and real estate professionals.</p>
          <p className="contact-lines">
            <a href="tel:+13106541577">(310) 654-1577</a><br />
            <a href="mailto:info@westccrealty.com">info@westccrealty.com</a>
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/listings">Homes</Link>
          <Link href="/open-houses">Open Houses</Link>
          <Link href="/neighborhoods">Neighborhoods</Link>
          <Link href="/market">Market Reports</Link>
        </div>
        <div>
          <h3>Connect</h3>
          <Link href="/for-realtors">For Local Realtors</Link>
          <Link href="/financing">Mortgage Center</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="legal">
        <div className="shell">
          <p>
            90210 Estate is an independent real estate marketing platform. Properties are presented with authorization from their respective listing agents. Information is deemed reliable but is not guaranteed and should be independently verified.
          </p>
          <p>
            Mortgage services are provided separately by West Coast Capital Mortgage Inc., NMLS #2817729. Anatoliy Kanevsky, NMLS #2775380, CA DRE Broker #01385024. Equal Housing Opportunity. This is not a commitment to lend.
          </p>
          <p>© {new Date().getFullYear()} 90210 Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
