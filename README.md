# 90210 Estate

An independent real estate marketplace for Beverly Hills, Bel Air, Holmby Hills, and nearby Westside neighborhoods.

## Positioning

90210 Estate is not presented as the inventory site of one brokerage. It is a permission-based showcase for properties represented by local listing agents. Each property keeps its listing-agent attribution and direct contact path. Mortgage services are optional and provided separately by West Coast Capital Mortgage Inc.

## Included

- Local home search and honest empty state until verified listings are approved
- Open-house and neighborhood pages
- Market-report framework without invented statistics
- Realtor partner page with a working email-based listing submission
- Mortgage payment calculator and separate WCCM handoff
- Responsive premium navy/gold design
- Updated legal and licensing disclosures
- Required `90210-estate` marketplace boundary for GR CRM public data

## Development

Run `npm install` and `npm run dev`. Create a production build with `npm run build`.

Create `.env.local` from `.env.example`. The public site must use the generic
marketplace feed and `MARKETPLACE_ID=90210-estate`; do not point it at another
marketplace-specific feed.

## Content policy

Do not add a listing, agent profile, photograph, statistic, school claim, or market figure unless its source and publication authorization have been verified.
