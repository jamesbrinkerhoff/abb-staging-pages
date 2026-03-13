#!/bin/bash
# Deploy an approved staging page to its own production Netlify site
#
# Usage: ./scripts/deploy-to-production.sh <page-folder> <site-name> [custom-domain]
#
# Examples:
#   ./scripts/deploy-to-production.sh offer my-offer-page
#   ./scripts/deploy-to-production.sh offer my-offer-page offername.com
#
# What it does:
#   1. Copies the page from pages/<folder>/ to a temp deploy dir
#   2. Includes shared assets (css, img)
#   3. Creates a new Netlify site named <site-name>
#   4. Deploys to production
#   5. Optionally adds a custom domain
#
# Result: https://<site-name>.netlify.app (or your custom domain)

set -euo pipefail

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PAGE_FOLDER="${1:?Usage: deploy-to-production.sh <page-folder> <site-name> [custom-domain]}"
SITE_NAME="${2:?Usage: deploy-to-production.sh <page-folder> <site-name> [custom-domain]}"
CUSTOM_DOMAIN="${3:-}"

PAGE_PATH="$REPO_ROOT/pages/$PAGE_FOLDER"

if [ ! -d "$PAGE_PATH" ]; then
    echo "Error: Page folder not found: $PAGE_PATH"
    exit 1
fi

# Create temp deploy directory
DEPLOY_DIR=$(mktemp -d)
trap "rm -rf $DEPLOY_DIR" EXIT

# Copy page files (flatten to root so index.html is at /)
cp -r "$PAGE_PATH/"* "$DEPLOY_DIR/"

# Copy shared assets if they exist
if [ -d "$REPO_ROOT/shared" ]; then
    cp -r "$REPO_ROOT/shared" "$DEPLOY_DIR/shared"
fi

echo "=== Creating Netlify site: $SITE_NAME ==="

# Get account slug
ACCOUNT_SLUG=$(netlify api listAccountsForUser 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['slug'])")

# Create the site
SITE_ID=$(netlify api createSite \
    --data "{\"account_slug\": \"$ACCOUNT_SLUG\", \"body\": {\"name\": \"$SITE_NAME\"}}" 2>/dev/null \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo "Site created: https://$SITE_NAME.netlify.app"
echo "Site ID: $SITE_ID"

# Deploy
echo "=== Deploying ==="
netlify deploy --prod --dir="$DEPLOY_DIR" --site="$SITE_ID"

# Add custom domain if provided
if [ -n "$CUSTOM_DOMAIN" ]; then
    echo "=== Adding custom domain: $CUSTOM_DOMAIN ==="
    netlify api createSiteDomain \
        --data "{\"site_id\": \"$SITE_ID\", \"body\": {\"hostname\": \"$CUSTOM_DOMAIN\"}}" 2>/dev/null
    echo ""
    echo "Domain added. Point your DNS:"
    echo "  CNAME  $CUSTOM_DOMAIN  →  $SITE_NAME.netlify.app"
    echo ""
    echo "Or if it's an apex domain (no www), use Netlify DNS:"
    echo "  https://app.netlify.com/projects/$SITE_NAME/domain-management"
fi

echo ""
echo "=== Done ==="
echo "Live at: https://$SITE_NAME.netlify.app"
[ -n "$CUSTOM_DOMAIN" ] && echo "Custom domain: https://$CUSTOM_DOMAIN (after DNS propagation)"
