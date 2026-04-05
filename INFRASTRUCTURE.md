# Infrastructure Setup

## Overview
This document outlines the infrastructure setup for the ACM Media Platform.

## Architecture

### Frontend & Hosting
- **Framework**: Next.js 15 (App Router)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Database & Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (for images)

### Monitoring & Analytics
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics
- **Performance**: Vercel Speed Insights

### CI/CD
- **CI**: GitHub Actions (lint, type-check, build)
- **CD**: GitHub Actions → Vercel deployment

### CDN
- **Static Assets**: Vercel Edge Network
- **Images**: Next.js Image Optimization + Cloudflare (optional)

## Environment Variables

See `.env.example` for required environment variables.

## Deployment Workflow

1. Developer pushes to `main` branch
2. GitHub Actions CI runs (lint, type-check, build)
3. If CI passes, GitHub Actions deploys to Vercel production
4. Sentry captures errors and performance data
5. Vercel Analytics tracks user metrics

## Database Schema

Tables will be created as we build features:
- `profiles` - User profiles
- `content` - Blog posts/articles
- `categories` - Content categorization
- `tags` - Content tags
- `media` - Image uploads

## Next Steps

1. Create GitHub repository
2. Push initial code
3. Set up Vercel project and connect GitHub
4. Create Supabase project
5. Configure Sentry
6. Set up custom domain
7. Test deployment pipeline
