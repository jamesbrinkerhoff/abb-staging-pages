# ABB Staging Pages

Staging / preview environment for Authority Brand Builder landing pages.

**Auto-deploys to Netlify** on every push to `main`.

## Structure

```
pages/
  offer/index.html        # Offer pages
  homepage/index.html     # Homepage variants
  vip/index.html          # VIP checkout pages
  cashleaks/index.html    # CashLeaks landing pages
  ...
shared/
  css/styles.css          # Shared styles
  img/                    # Shared images
```

## Workflow

1. Claude Code builds or revises pages in `pages/`
2. Push to `main`
3. Netlify auto-deploys to preview URL
4. Review live preview
5. Once approved, move to production

## URLs

Each page folder becomes a path on the preview site:
- `pages/offer/index.html` → `https://abb-staging-pages.netlify.app/pages/offer/`
- `pages/vip/index.html` → `https://abb-staging-pages.netlify.app/pages/vip/`
