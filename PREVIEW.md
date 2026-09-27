# Local presentation

Run `npm run demo` and open http://localhost:5174/ . The npm command name is internal; the website has no demo banner or simulated offers.

For a standalone build: `npm run build:demo`, then `npm run preview -- --port 4173`. This explicitly includes the local catalog adapter. A normal production build does not enable that adapter; it expects the API.

The welcome, login, header, home carousel, category/cuisine rails and restaurant-card design come from upstream main (`2f532f4`). The menu add buttons, shared cart, and whole-cart comparison are connected to collected menus.

## Coverage

42 restaurant listings, 1,601 menu entries, and 1,627 collected prices (including 60 restaurant-website pickup prices). Some menus are partial. Twenty-four listings have attributed DoorDash rating aggregates; ten have official restaurant-ordering links. Eight public promotion records cover provider and restaurant-app offers, subject to eligibility and expiry. Taco Boyz at 520 Smythe St and McDonald’s at 1177 Prospect St are the two thoroughly checked presentation paths. Restaurant addresses and reviewed branch associations come from the existing catalog API. The source adapter retains the branch’s exact provider URL; it does not match brands across unrelated locations.

Menus and locally cached photos load without requesting provider websites. Fifteen distinct Luna dish photos come from its own ordering page. Other food photography is illustrative and sometimes reused for similar items or sizes. Larger source renditions replace the small shared photos where available; the manifests record verified dimensions. Image URLs are recorded in `public/images/menu/sources.json` and `restaurants.json`. Restaurant art is from the corresponding collected provider listings. Photo portions, toppings and product variants may differ.

Only collected prices appear. Missing prices, checkout fees and tax require confirmation at checkout. Promotion panels link to official terms and show account, membership, minimum-spend and fulfillment restrictions; discounts are never automatically deducted. A complete fixed-price item subtotal can be ranked; it is never described as the cheapest delivered total. Starting prices and pickup-only prices are excluded from that badge. Expired, changed or unverified-for-72-hours promotions are hidden automatically. Delivery-provider comparisons include an additional restaurant-ordering card where a verified official link exists. A brand location selector is not represented as a branch-specific quote. Skip currently has one verified restaurant listing (Taco Boyz).

Handoff copies the item names and quantities and opens the exact restaurant menu. It does not create a provider cart or place an order. Options and final checkout costs are confirmed in the provider app.

## Presentation paths

- Taco Boyz: add two Large Loaded Fries and one Water. DoorDash and Skip each have a listed $34.85 item subtotal; Uber’s missing prices remain unquoted.
- McDonald’s: add two Big Macs. Uber’s item subtotal is $16.78, DoorDash’s is $17.18. Skip’s branch/menu is unavailable.
- Switch restaurants: choose “Start new cart” when prompted. Quantities and the header badge update together, and the cart survives refresh. “Clear cart” removes it permanently from this browser.

## Data ownership and refresh

Acquisition/enrichment, image downloads and export stay in `nibble-data-acquisition/scripts/`; see that repository’s `ENRICHMENT.md` for collection and review procedures. The exporter consumes the validated public catalog, uses reviewed provider/branch identities, preserves source URLs and starting-price metadata, and emits `src/catalog/catalog.json` using the existing storefront entity types. It never creates substitute prices and does not publish illustrative data into the live ingestion pipeline.

To regenerate, save the current API response from `/v1/catalog` to a JSON file, then run:

```sh
python3 ../nibble-data-acquisition/scripts/collect_enrichment.py
python3 ../nibble-data-acquisition/scripts/export_storefront_catalog.py --catalog /path/to/catalog.json
```

This presentation uses a bundled read model through the upstream local Axios adapter. It does not continuously refresh from the API. The backend collector and its schedule remain separate. Production API wiring and external cart creation remain future work.

## Verification

`npm run test:cart` tests quantities, incomplete baskets, tied rankings, starting prices, mixed-restaurant rejection, photo file coverage, price provenance, pickup exclusions, promotion scope/expiry, and the separate direct-menu branch. Requires Node 24 or newer for native TypeScript loading. Browser checks cover both main menus, images, cart persistence, restaurant switching, provider links, and mobile layout.

Luna’s own ordering menu at 379 King Street is kept separate from the provider listing at a different address. It has 61 entries, including one unconfigured zero-price entry that remains unquoted. Its prices are pickup base prices, not delivery quotes.
