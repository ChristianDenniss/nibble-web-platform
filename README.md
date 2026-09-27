# nibble-web-platform

The Nibble browser UI. Vite + React app that talks to `nibble-api-engine` over HTTP.

**Why this repo exists:** presentation is not the domain and not the API. Shipping UI in its own repo lets the frontend version, build, and deploy on its own cadence. It consumes HTTP; it does not import Go modules.

Domain types live in `nibble-go-data-model`. TypeScript copies are generated (`src/generated/data-model.ts`). Do not redefine restaurants, offers, accounts, or the rest here.

Brand: Nibble — pastel pink + warm white + charcoal. Tokens live in `src/styles/globals.css`.

## Local presentation

See [PREVIEW.md](PREVIEW.md) for startup commands, restaurant coverage, image sources, and verified cart flows.
