# Infrastructure Setup

## Overview
This document outlines the infrastructure setup for the ACM Media Platform.

## Architecture

### Frontend & Hosting
- **Framework**: Next.js 15 (App Router)
- **Hosting**: Cloudflare Pages
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Database & Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (for images)

### Monitoring & Analytics
- **Error Tracking**: Sentry
- **Analytics**: Cloudflare Web Analytics (optional)
- **Performance**: Cloudflare Analytics

### CI/CD
- **CI**: GitHub Actions (lint, type-check, build)
- **CD**: GitHub Actions → Cloudflare Pages deployment

### CDN
- **Static Assets**: Cloudflare CDN
- **Images**: Next.js Image Optimization + Cloudflare Images (optional)

## Environment Variables

See `.env.example` for required environment variables.

## Deployment Workflow

1. Developer pushes to `main` branch
2. GitHub Actions CI runs (lint, type-check, build)
3. If CI passes, GitHub Actions deploys to Cloudflare Pages production
4. Sentry captures errors and performance data
5. Cloudflare Web Analytics tracks user metrics (optional)

## Database Schema

Tables will be created as we build features:
- `profiles` - User profiles
- `content` - Blog posts/articles
- `categories` - Content categorization
- `tags` - Content tags
- `media` - Image uploads

## Next Steps

### Completed ✅
1. ✅ GitHub repository created (https://github.com/chiltalk/acm-media-platform)
2. ✅ Initial code pushed to main
3. ✅ CI/CD workflows configured (GitHub Actions)
4. ✅ Deployment workflow updated for Cloudflare Pages

### In Progress 🚧
1. 🚧 Connect GitHub repository to Cloudflare Pages (manual)
   - Go to Cloudflare Dashboard → Pages → Create a project
   - Connect GitHub account
   - Select `chiltalk/acm-media-platform` repository
   - Configure build settings: `npm run build`, output directory: `.next`
   - Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Pending 📋
1. 📋 Create Supabase project
2. 📋 Run database migration scripts (see DATABASE_SCHEMA.md)
3. 📋 Configure Sentry error tracking
4. 📋 Set up custom domain (optional)
5. 📋 Test full deployment pipeline
