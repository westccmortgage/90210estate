import type { Metadata } from "next";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://90210estate.com"),
  title: {
    default: "90210 Estate | Beverly Hills Homes & Local Agents",
    template: "%s | 90210 Estate",
  },
  description:
    "An independent real estate marketplace for homes, open houses, neighborhoods, and agents across Beverly Hills, Bel Air, and Holmby Hills.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "90210 Estate",
    description: "The local marketplace for Beverly Hills homes and real estate professionals.",
    url: "https://90210estate.com",
    siteName: "90210 Estate",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
