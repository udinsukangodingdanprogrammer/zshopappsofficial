# ZSHOPAPPS Code Maintenance Structure

This package keeps the existing website behavior and visual cascade while separating the large inline CSS/JavaScript blocks from `index.html`.

## Structure

- `index.html` — markup, structured-data JSON, and playlist JSON.
- `assets/css/zshopapps-core.css` — styles that originally appeared before the Tailwind browser runtime.
- `assets/css/zshopapps-overrides.css` — styles that originally appeared after the Tailwind runtime.
- `assets/js/*.js` — JavaScript split by feature, loaded at the same DOM positions as the previous inline scripts.
- Existing images, audio, manifests, sitemap, robots, Netlify/GitHub configuration remain in place.

## Maintenance rules

1. Keep CSS cascade order intentional. Put foundational rules in `zshopapps-core.css`; feature patches/overrides belong in `zshopapps-overrides.css`.
2. Prefer editing the feature JavaScript file whose name matches the feature instead of adding another inline `<script>` block.
3. Keep configuration values centralized in `assets/js/zshopapps-core.js` when they are truly global.
4. Avoid adding duplicate CSS selectors merely to override earlier patches. Consolidate a selector only after confirming all responsive states.
5. Preserve checkout, QRIS, SeaBank, cart, Extension 04/05, social links, language, music, and weather behavior unless a feature change is explicitly requested.
6. Run JavaScript syntax checks and a browser smoke test after every structural change.

## Why there are two CSS bundles

The original page loaded part of its CSS before the Tailwind browser runtime and another set of overrides after it. Combining everything into one stylesheet would change cascade order. The two-bundle structure preserves that order while making the code easier to navigate.
