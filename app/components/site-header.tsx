"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["/listings", "Homes"],
  ["/agents", "Agents"],
  ["/open-houses", "Open Houses"],
  ["/neighborhoods", "Neighborhoods"],
  ["/market", "Market"],
  ["/for-realtors", "For Realtors"],
  ["/financing", "Financing"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const crmLogin = `${(process.env.NEXT_PUBLIC_GRCRM_URL || "https://grcrm.com").replace(/\/$/, "")}/login?source=90210-estate&marketplace=90210-estate`;
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" onClick={() => setOpen(false)} aria-label="90210 Estate">
          <span className="brand-mark" aria-hidden="true"><i /><b /></span>
          <span><strong>90210</strong><small>Estate</small></span>
        </Link>
        <nav className={open ? "nav open" : "nav"} aria-label="Primary navigation">
          {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <a className="nav-cta" href={crmLogin} onClick={() => setOpen(false)}>Agent login</a>
        </nav>
        <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
