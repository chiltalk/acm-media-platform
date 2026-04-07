#!/bin/bash

# ACM Media Platform - Deployment Verification Script
# This script checks if the deployment is working correctly

set -e

echo "🔍 ACM Media Platform - Deployment Verification"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if deployment URL is provided
if [ -z "$1" ]; then
    DEPLOY_URL="https://acm-media-platform.pages.dev"
    echo "📍 Using default deployment URL: $DEPLOY_URL"
else
    DEPLOY_URL="$1"
    echo "📍 Using deployment URL: $DEPLOY_URL"
fi

echo ""
echo "Running checks..."
echo ""

# Check 1: Site is accessible
echo -n "1. Checking if site is accessible... "
if curl -s --head "$DEPLOY_URL" | head -n 1 | grep "200" > /dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Site is responding with 200 OK"
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Site is not accessible or not returning 200 OK"
    exit 1
fi

# Check 2: HTML is being served
echo -n "2. Checking if HTML is being served... "
if curl -s "$DEPLOY_URL" | grep -q "<html"; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   HTML content detected"
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   No HTML content found"
    exit 1
fi

# Check 3: Static assets are accessible
echo -n "3. Checking static assets... "
if curl -s --head "$DEPLOY_URL/_next/static" | head -n 1 | grep "200\|404" > /dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Static assets endpoint is reachable"
else
    echo -e "${YELLOW}⚠️  WARNING${NC}"
    echo "   Could not verify static assets"
fi

# Check 4: No critical errors in response
echo -n "4. Checking for critical errors... "
RESPONSE=$(curl -s "$DEPLOY_URL")
if echo "$RESPONSE" | grep -qi "error\|exception\|fatal"; then
    echo -e "${YELLOW}⚠️  WARNING${NC}"
    echo "   Potential errors detected in response"
    echo "   Please check the site manually"
else
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   No critical errors detected"
fi

# Check 5: Environment variables are configured (basic check)
echo -n "5. Checking environment configuration... "
if echo "$RESPONSE" | grep -q "NEXT_PUBLIC"; then
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Environment variables are not configured properly"
    echo "   Public variables are leaking to the client"
    exit 1
else
    echo -e "${GREEN}✅ PASS${NC}"
    echo "   Environment configuration looks good"
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "1. Visit the site in your browser: $DEPLOY_URL"
echo "2. Test all features manually"
echo "3. Check browser console for errors"
echo "4. Verify database connections"
echo ""

# Optional: Open the site in a browser
if command -v open &> /dev/null; then
    echo "Opening site in default browser..."
    open "$DEPLOY_URL"
elif command -v xdg-open &> /dev/null; then
    echo "Opening site in default browser..."
    xdg-open "$DEPLOY_URL"
fi