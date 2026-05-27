---
name: sales-page
description: >-
  Build long-form, direct-response sales/landing pages in the high-energy
  "founder's letter" style of the Claude Code Accelerator page — especially for
  WORKSHOPS, but also offers, VSLs, challenges, and product launches. Use when
  the user wants to create, write, or design a sales page, landing page, offer
  page, workshop registration page, or VSL letter, or asks to "make a sales page
  like that one." Reproduces the copy formula, dark high-contrast visual style,
  bold display typography, big-number callouts, day-by-day agenda, named
  mechanism + flywheel diagram, price-anchored pricing card, countdown, two-paths
  close, and scroll/count-up animations.
---

# Sales Page Builder

Produces a complete, single-file, deployable direct-response sales page that
matches the look **and** the copywriting of the reference page (a Genesis /
CopyCoders "founder's letter" workshop page). Two layers: a **copy formula** and a
**design system**, both encoded in this skill.

## When to use

Creating or rewriting any persuasion-driven page: workshop registration, offer
page, VSL sales letter, challenge/launch page, webinar sign-up. Default to this
style for workshops.

## Workflow

1. **Gather the offer details.** Ask the user for whatever's missing (don't
   invent these — they're the spine of the page):
   - Host name + title + company; the brand name.
   - What the workshop/offer is, the dates/times, and the price (+ payment plan).
   - The transformation: where the buyer starts → where they end up.
   - The named mechanism (or offer to coin one — see copy formula §4).
   - The origin/proof story and any specific credentials, numbers, results.
   - Day-by-day agenda (titles, who leads each, outcomes).
   - The real deadline (for the countdown) and the checkout URL.
   If the user just says "make me a workshop page," ask for these in one batched
   `AskUserQuestion` rather than guessing.

2. **Read the references before writing.** Load both:
   - `references/copy-formula.md` — voice, emphasis mechanics, the section
     sequence, persuasion devices, and a fill-in skeleton. **Follow the section
     order.** Match the cadence (one-sentence paragraphs, fragment triplets,
     strategic CAPS, claim-style headers, parenthetical asides).
   - `references/design-system.md` — tokens, typography, components, animations.

3. **Write the copy first, then place it.** Draft the letter using the formula,
   then drop it into the template's matching sections. The copy carries the page;
   never ship the `[BRACKET]` placeholders.

4. **Assemble the page from the template.** Copy `assets/template.html` to the
   output path and fill every section. Keep it a single self-contained file
   (inline `<style>` + `<script>`, Google Fonts the only external request) —
   matches this repo's other pages and the source page's "one file, coded in
   Claude Code" ethos.
   - Set the real countdown deadline in the `TARGET` line of the script (ISO 8601
     with timezone).
   - Wire CTA `href`s to the real checkout URL.
   - Tune `data-count` / `data-prefix` / `data-suffix` on the big-number stats.
   - Adjust the `--accent` tokens if the brand isn't orange; the rest cascades.

5. **Output location (this repo).** Write to `pages/<slug>/index.html` so Netlify
   serves it at `/<slug>/` on push. Pick a short kebab-case slug from the offer
   name.

6. **Preview before claiming done.** Open the file in a browser (or describe how
   to) and verify: headlines render in the display font, scroll-reveal fires,
   numbers count up, the flywheel spins, the countdown ticks, and the layout holds
   on mobile width. Report what you verified.

## Quality bar

- Copy reads like a person wrote it under deadline pressure, not a template.
  Specific > vague. If a credential or number isn't real, ask — don't fabricate
  proof.
- Every section from the formula's sequence is present or deliberately dropped.
- The named mechanism appears, with the flywheel diagram tied to it.
- Price uses the anchor ladder; the page has a real deadline and a two-paths
  close; the P.S. stack does its three jobs (stakes / risk-reversal / proof flex).
- No leftover `[BRACKETS]`. No emojis unless the brand uses them (the announcement
  bar has one — keep or cut per brand).
- Respects `prefers-reduced-motion` (already handled in the template script).

## Files

- `references/copy-formula.md` — the copywriting engine (read every time).
- `references/design-system.md` — tokens, components, animation patterns.
- `assets/template.html` — complete working starter; copy and fill in.
