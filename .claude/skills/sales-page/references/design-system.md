# Design System — Direct-Response Sales Page

The visual language that carries the copy. Dark, high-contrast, big bold type,
electric accent, motion that rewards scrolling. `assets/template.html` implements
all of this — this doc explains the tokens and components so you can extend it
without breaking the look.

> Note: the source page blocks automated fetching, so the exact CSS could not be
> scraped. This system is a faithful reconstruction of the genre (and is itself a
> single self-contained file, matching the source's "coded in Claude Code, every
> section, every animation" approach). Swap the tokens to match any brand.

---

## Design tokens (CSS custom properties)

```css
:root {
  /* Surfaces — near-black, layered */
  --bg:        #0a0a0b;
  --bg-2:      #0f0f11;
  --surface:   #16161a;
  --surface-2: #1d1d22;
  --line:      rgba(255,255,255,.09);

  /* Text */
  --text:  #f5f5f4;
  --muted: #a1a1aa;
  --dim:   #71717a;

  /* Accent — warm electric orange (on-brand for Claude; swap freely) */
  --accent:   #ff5a1f;
  --accent-2: #ffb020;   /* amber, for big numbers */
  --glow:     rgba(255,90,31,.45);

  /* Semantic — used by the two-paths close */
  --bad:  #ef4444;       /* Option 1 / the old way */
  --good: #22c55e;       /* Option 2 / the new way */

  --radius: 18px;
  --radius-lg: 28px;
  --shadow: 0 24px 60px rgba(0,0,0,.45);
  --maxw: 760px;         /* readable letter column */
}
```

**Theme swaps:** for a "premium/clean" variant, set `--bg:#fafaf9; --text:#0a0a0b;
--surface:#fff; --line:rgba(0,0,0,.08)` and keep the accent. Everything else
cascades.

## Typography

Two families. Load from Google Fonts with `preconnect`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
--font-display: "Archivo", system-ui, sans-serif;  /* headers, big numbers */
--font-body:    "Inter", system-ui, sans-serif;     /* paragraphs */
```

- **Headlines:** `--font-display`, weight **800–900**, `letter-spacing:-.02em`,
  `line-height:1.05`. This is what gives the "loud" feel.
- **Body:** `--font-body`, weight 400–500, `line-height:1.7`, `font-size:1.18rem`.
  Letter copy must be comfortable to read.
- **For a more aggressive look,** swap display to `"Anton"` or `"Oswald"`
  (condensed) — especially on the big-number callouts. Documented; don't change
  body.
- **Type scale (clamp for fluid responsive):**
  - H1 hero: `clamp(2.4rem, 6vw, 4.2rem)`
  - Section claim (H2): `clamp(1.9rem, 4.5vw, 3rem)`
  - Big-number figure: `clamp(3.5rem, 12vw, 8rem)`
  - Eyebrow/label: `.8rem`, `letter-spacing:.18em`, `text-transform:uppercase`

**Emphasis classes:** `<strong>` = accent-tinted bold; wrap key phrases in
`<span class="hl">` for an accent highlight, and use `.cap` only when you truly
want a word to shout. The copy's ALL-CAPS words can be typed literally OR set with
`text-transform:uppercase` via `.cap`.

## Layout

- Single centered **letter column** at `--maxw` (~760px) for all prose. Long-form
  reads best narrow.
- **Full-bleed bands** (`.band`) for the mechanism, agenda, pricing, and
  two-paths sections — alternate `--bg` / `--bg-2` to segment the page.
- Generous vertical rhythm: sections `padding: clamp(48px, 9vw, 110px) 0`.
- Background flourish: subtle radial "aurora" glows behind the hero and pricing
  (`radial-gradient` of `--glow`, very low alpha). Keep it tasteful.

## Components

1. **Announcement bar** (`.announce`) — thin top strip, accent background, dark
   text, dismissible-looking. Holds urgency: "🔴 Doors close June 5 · Live starts
   June 3 @ 1PM ET".
2. **Sticky header** (`.site-header`) — frosted (`backdrop-filter:blur`), brand
   left, **mini countdown** + primary CTA right. Gains a bottom border + stronger
   blur after scrolling 40px (toggle `.scrolled`).
3. **Eyebrow** (`.eyebrow`) — uppercase tracked label above a headline; often the
   "A Shocking Message From [Name]" line, with a small accent dot.
4. **Section claim** (`h2.claim`) — the bold CLAIM headers from the copy. Accent
   words via `.hl`.
5. **Big-number callout** (`.stat`) — giant figure (`data-count` triggers the
   count-up) + caption. Use for `48 HRS`, `50–100×`, `$25K`, `$297`. Multiple in a
   row = `.stat-row`.
6. **Lists:**
   - `.checks` — accent ✓ bullets, for capability/outcome lists.
   - `.creds` — for the "A-players in the room" credential stack; each `<li>` a
     dense one-liner.
7. **Agenda card** (`.day`) — `Day N · date` badge, claim title, "Led by [Name]",
   bio, `.checks` outcomes. Hover lifts.
8. **Dual-flywheel diagram** (`.flywheel`) — two interlocking rotating rings (SVG
   + CSS `@keyframes spin`) labeled "SYSTEM" and "YOU" with curved arrows; speeds
   up briefly when scrolled into view. Caption: "Sharper system → Sharper you →
   Sharper system."
9. **Numbered promise** (`.promise`) — big accent number badge + outcome line.
10. **Two-paths block** (`.paths`) — two columns: `.path.bad` (red-tinted border,
    ✗ bullets, "Option #1 — Keep doing what you're doing") and `.path.good`
    (green/accent border, ✓ bullets, "Option #2 — You adapt").
11. **Pricing card** (`.price-card`) — centered, elevated, accent glow. Struck
    anchor prices (`<s>$997</s> <s>$497</s>`), giant current price, payment-plan
    line, benefit-loaded CTA, "Lifetime access" reassurance, embedded countdown.
12. **CTA button** (`.btn`) — large pill, accent fill, white text, soft glow
    (`box-shadow: 0 10px 30px var(--glow)`); hover = lift + brighter glow. Long
    descriptive labels are good here.
13. **Signature** (`.sign`) — first-name sign-off, then name · title · company.
14. **P.S. stack** (`.ps`) — bordered-left blocks, label "P.S." in accent.

## Motion / animation

All vanilla JS — no libraries. Implemented in the template's `<script>`.

- **Scroll reveal** — elements with `.reveal` start `opacity:0; translateY(24px)`
  and animate in via `IntersectionObserver` adding `.in`. Stagger with a small
  `transition-delay` per child. Respect `prefers-reduced-motion`.
- **Count-up numbers** — `.stat [data-count]` counts from 0 to target on first
  view (handles `$`, `×`, `K`, `HRS` suffixes/prefixes via `data-prefix` /
  `data-suffix`).
- **Flywheel spin** — continuous slow rotation; `IntersectionObserver` adds
  `.spinning` to briefly accelerate when in view.
- **Sticky header state** — `.scrolled` toggled past 40px for border/blur.
- **Countdown timer** — single `initCountdown(targetISO)` updates every element
  with `[data-countdown]` (DD HH MM SS); when it hits zero, swap CTAs to a
  "Doors closed" state. One target date drives header + pricing.
- **Button hover** — transform + glow transition (`.18s ease`).
- **Reduced motion** — wrap reveals/spin in
  `@media (prefers-reduced-motion: no-preference)` and bail out of JS animations
  if `matchMedia('(prefers-reduced-motion: reduce)')` matches.

Keep it self-contained: one HTML file, inline `<style>` + `<script>`, Google
Fonts the only external request. This matches the repo's existing pages and the
source page's "one file, coded in Claude Code" ethos.
