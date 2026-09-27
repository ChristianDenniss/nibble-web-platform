# Local presentation

Run `npm run demo` and open http://localhost:5174/ . The npm command name is internal; the website has no demo banner or simulated offers.

For a standalone build: `npm run build:demo`, then `npm run preview -- --port 4173`. This explicitly includes the local catalog adapter. A normal production build does not enable that adapter; it expects the API.

The welcome, login, header, home carousel, category/cuisine rails and restaurant-card design come from upstream main (`fb77d61`). The menu add buttons, shared cart, and whole-cart comparison are connected to collected menus.

## Coverage

12 Fredericton restaurants, 844 menu entries, and 871 collected provider prices. Taco Boyz at 520 Smythe St and McDonald’s at 1177 Prospect St are the two thoroughly checked presentation paths. Restaurant addresses and reviewed branch associations come from the existing catalog API. The source adapter retains the branch’s exact provider URL; it does not match brands across unrelated locations.

Menus and locally cached photos load without requesting provider websites. Food photography is illustrative and sometimes reused for similar items or sizes. Image URLs are recorded in `public/images/menu/sources.json` and `restaurants.json`. Restaurant art is from the corresponding collected provider listings. Photo portions, toppings and product variants may differ.

Only collected prices appear. Missing prices, checkout fees, tax and promotions say “Confirm in app.” A complete fixed-price item subtotal can be ranked; it is never described as the cheapest delivered total. Starting prices are excluded from that badge. All three providers are shown, but only known branch links are actionable. Skip currently has one verified restaurant listing (Taco Boyz).

Handoff copies the item names and quantities and opens the exact restaurant menu. It does not create a provider cart or place an order. Options and final checkout costs are confirmed in the provider app.

## Presentation paths

- Taco Boyz: add two Large Loaded Fries and one Water. DoorDash and Skip each have a listed $34.85 item subtotal; Uber’s missing prices remain unquoted.
- McDonald’s: add two Big Macs. Uber’s item subtotal is $16.78, DoorDash’s is $17.18. Skip’s branch/menu is unavailable.
- Switch restaurants: choose “Start new cart” when prompted. Quantities and the header badge update together, and the cart survives refresh. “Clear cart” removes it permanently from this browser.

## Data ownership and refresh

Acquisition/export stays in `nibble-data-acquisition/scripts/export_storefront_catalog.py`. The exporter consumes the validated public catalog, uses reviewed provider/branch identities, preserves source URLs and starting-price metadata, and emits `src/catalog/catalog.json` using the existing storefront entity types. It never creates substitute prices and does not publish illustrative data into the live ingestion pipeline.

To regenerate, save the current API response from `/v1/catalog` to a JSON file, then run:

```sh
python3 ../nibble-data-acquisition/scripts/export_storefront_catalog.py --catalog /path/to/catalog.json
```

This presentation uses a bundled read model through the upstream local Axios adapter. It does not continuously refresh from the API. The backend collector and its schedule remain separate. Production API wiring and external cart creation remain future work.

## Verification

`npm run test:cart` tests quantities, incomplete baskets, tied rankings, starting prices, mixed-restaurant rejection, photo file coverage, and price provenance. Requires Node 24 or newer for native TypeScript loading. Browser checks cover both main menus, images, cart persistence, restaurant switching, provider links, and mobile layout.
