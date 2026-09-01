# ZSHOPAPPS Extension 06 Naruto + Commerce Upgrade — Design

Date: 2026-08-29
Target: existing static GitHub Pages site in `index.html`

## Goal
Upgrade the current ZSHOPAPPS static storefront without replacing its existing cart/QRIS/Telegram flows. Add Extension 06 Naruto, correct Preflix Lifetime price, expose foreign-currency estimates while keeping QRIS settlement in IDR, add multilingual UI, improve image zoom, remove transparent/glass framing from the iOS/MacBook table, and preserve responsive behavior across Android, iOS, tablets, MacBook, laptops, and desktop PCs.

## Existing architecture
The uploaded project is a static GitHub Pages package centered on a large single `index.html` plus assets. Existing products use `data-*` attributes and a shared JavaScript cart. Extension 04 and 05 have their own presentation/payment UI, while the shared catalog and earlier extensions participate in the common cart/QRIS flow.

## Chosen approach
Keep the static architecture. Add Extension 06 as a new semantic section inside `index.html`, but model its purchasable cards with the same `data-name`, `data-plans-asia`, `data-default-asia`, and `data-product-type` attributes used by the shared cart. This avoids a second cart implementation. Styling and behavior specific to Extension 06 will be isolated under `#extension-06-naruto` and script/style IDs so current sections remain unaffected.

Alternative approaches considered:
1. Rewrite the whole site into React/Vue: rejected because it adds deployment complexity and risks breaking existing static flows.
2. Create a second independent Extension 06 checkout engine: rejected because users would get inconsistent carts and QRIS totals.
3. Extend the current static cart and add isolated Extension 06 presentation: selected because it is the least disruptive and fits the existing codebase.

## Extension 06 catalog
Section name: `ZSHOPAPPS Extension 06 Naruto`.

Products and fixed IDR prices:
- Paket Boruto — 1 Bulan — Rp95.000
- Paket Super Boruto — 1 Bulan — Rp180.000
- Paket Orochimaru — 3 Bulan — Rp230.000
- Paket Super Orochimaru — 3 Bulan — Rp450.000
- Paket Sasuke — 6 Bulan — Rp400.000

The user wrote “Orachimaru”; the public-facing product name will use the canonical spelling “Orochimaru” while keeping the requested price/duration mapping.

Each product can be added to the shared cart. Quantity follows the existing unlimited digital-product behavior unless an existing global cart rule says otherwise.

## Extension 06 visual design
Use an Akatsuki/Naruto-inspired dark red/black sales aesthetic, but keep the section self-contained and readable. Use solid card surfaces instead of glass/transparent frames. Add subtle entrance/reveal, hover/focus elevation, active package pulse/glow, and reduced-motion fallbacks.

Use the supplied promotional images as zoomable media. Add click/tap image lightbox with keyboard Escape close, focus management, backdrop click close, and pinch/browser-native zoom-friendly full-size presentation. Main showcase image and Extension 06 package visuals will support zoom.

## iOS / MacBook table
Remove transparent/glass framing from the existing `Tabel Tampilan iOS & MacBook` area in Extension 04. Use opaque solid backgrounds and borders, no `backdrop-filter`, no translucent outer panel. Preserve horizontal readability on narrow devices.

## Preflix Lifetime price
Change every user-facing and machine-readable Preflix price from Rp309.000 / `309000` to Rp300.000 / `300000`, including:
- Product JSON-LD
- Product card data attributes
- Price labels and table totals
- Lifetime script constant
- Owner/contact copy that mentions the old amount
- Any duplicated summary text

QRIS settlement remains IDR.

## Currency display
IDR remains the source-of-truth price and checkout currency.

Add a currency selector for: IDR, USD, SGD, MYR, EUR, JPY, THB, AUD, GBP.

Behavior:
- Display converted amounts as estimates beside/under IDR prices.
- QRIS and cart final settlement always remain IDR.
- Attempt to fetch current public FX rates client-side from a no-key endpoint.
- Cache the last successful rate set in `localStorage` with timestamp.
- If network fetch fails, use a bundled fallback rate table and mark values as estimates.
- Never silently replace the canonical IDR amount.

## Multilingual UI
Add a language selector and translate the new commerce/navigation/help content into:
- Indonesian (default)
- English
- Malay
- Japanese
- Simplified Chinese
- Korean
- Arabic
- Spanish

Implementation uses a client-side dictionary keyed by `data-i18n` attributes. Product/brand names, fixed codes, currency codes, Telegram handles, and legal/technical identifiers are not translated. Existing long legacy content will not be machine-translated blindly; the new and primary commerce/navigation text receives deterministic translations.

## Extension 06 purchase flow
1. User selects a package card.
2. User can add it to the shared cart.
3. Cart totals are calculated in canonical IDR.
4. Optional currency selector shows converted estimates only.
5. User opens/scans main QRIS.
6. User sends order/payment proof through the existing official Telegram flow (and existing supported contact path where the current site already allows it).

Add a dedicated Extension 06 QRIS call-to-action that scrolls/links to the main QRIS section, plus summary of selected package and amount.

## Secret gift codes
Add a “Hadiah Kode Rahasia Extension 06” reveal component with two requested codes:
- `ZshopappsAkatsuki`
- `UZUMAKI-85E`

Because the site is fully static, the codes cannot be genuinely protected from someone inspecting page source. The UI will hide/reveal them visually and provide copy buttons. It will not claim server-side protection or payment-gated security.

## Content additions
Add an Extension 06 “Tentang kegunaan” section explaining that the package gives access to the ZSHOPAPPS extension/catalog workflow according to the package selected and owner confirmation.

Add Q&A covering:
- Difference between regular and Super packages
- Whether QRIS uses IDR
- How foreign currency display works
- How to add Extension 06 to cart
- How image zoom works
- Where the secret gift code is shown
- Device/browser compatibility

Add a navigation/menu entry: `Akatsuki Extension` / `Extension 06 Naruto` in desktop and mobile menus.

## Responsive behavior
Test breakpoints and overflow on representative widths:
- 320px / 360px / 390px / 430px phones
- 768px tablet
- 1024px tablet/small laptop
- 1280px laptop
- 1440px / 1920px desktop

Requirements:
- no horizontal page overflow
- touch targets at least approximately 40–44px where practical
- package cards stack/scroll cleanly on phones
- lightbox fits viewport
- cart remains operable
- RTL direction activates for Arabic text without breaking numeric/product elements

## Error handling
- FX API failure -> cached rates -> bundled fallback rates.
- Missing zoom image -> original thumbnail remains and no broken modal opens.
- `localStorage` unavailable -> selectors still work for current session.
- Unknown language key -> fall back to Indonesian source string.
- Cart parsing error -> do not remove existing cart; skip invalid Extension 06 item and preserve other items.

## Testing
Static checks:
- Search confirms no remaining `309000` / `Rp309.000` Preflix references intended for current UI/schema.
- All Extension 06 product data JSON parses.
- All referenced local images exist.
- No duplicate critical IDs.
- `asset-manifest.json` regenerated after modification.

Runtime checks with browser automation or equivalent DOM execution where available:
- add each Extension 06 product to cart
- quantity increment/decrement
- cart total IDR correctness
- Preflix total uses Rp300.000
- language switch updates tagged UI
- currency switch never changes QRIS canonical IDR total
- secret-code reveal/copy
- zoom open/close with mouse, touch-oriented click, Escape
- responsive overflow checks at target widths
- reduced-motion CSS behavior

## Files to modify
- `index.html`
- `README.md`
- new `CHANGELOG-2026-08-29.txt`
- `asset-manifest.json`
- `sitemap.xml` lastmod if appropriate
- optional new Extension 06 image copies under `assets/images/extensions/` if required from supplied source images

## Deployment output
Produce a new ZIP containing the complete deployable site root, preserving `.github`, `.nojekyll`, assets, manifest, and all existing files.
