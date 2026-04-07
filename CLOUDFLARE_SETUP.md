# Cloudflare Pages Setup Guide

This guide provides step-by-step instructions for connecting the ACM Media Platform to Cloudflare Pages.

## Prerequisites

- Cloudflare account (free tier works)
- GitHub account with access to `chiltalk/acm-media-platform` repository
- Supabase project credentials (URL and anon key)

## Step 1: Install Cloudflare CLI (Optional)

If you prefer CLI over the dashboard:

```bash
npm install -g wrangler
wrangler login
```

## Step 2: Connect Repository via Dashboard

### Option A: Cloudflare Dashboard (Recommended for first setup)

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Sign in to your account

2. **Navigate to Pages**
   - In the left sidebar, click "Workers & Pages"
   - Click "Create application"

3. **Connect GitHub**
   - Click "Connect to Git"
   - Select GitHub as your Git provider
   - Authorize Cloudflare to access your GitHub account if prompted

4. **Select Repository**
   - Find and select `chiltalk/acm-media-platform`
   - Click "Begin setup"

5. **Configure Build Settings**
   ```
   Build command: npm run build
   Build output directory: .next
   Root directory: (leave empty)
   ```

6. **Environment Variables**
   Add the following environment variables (Production):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SENTRY_DSN=your_sentry_dsn (optional)
   ```

7. **Deployment Configuration**
   - Branch: `main`
   - Preset: "Next.js"
   - Click "Save and Deploy"

### Option B: Using Wrangler CLI

```bash
# Create a new Pages project
wrangler pages project create acm-media-platform --production-branch=main

# Set environment variables
wrangler pages secret put NEXT_PUBLIC_SUPABASE_URL
wrangler pages secret put NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy manually (optional - GitHub Actions will handle this)
npm run build
wrangler pages deploy .next
```

## Step 3: Configure GitHub Actions Secrets

1. **Get Cloudflare Credentials**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template
   - Set permissions:
     - Account > Cloudflare Pages > Edit
   - Copy the API token

2. **Get Account ID**
   - In Cloudflare Dashboard, go to Workers & Pages
   - Your Account ID is visible in the right sidebar

3. **Add Secrets to GitHub**
   - Go to: https://github.com/chiltalk/acm-media-platform/settings/secrets/actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your API token from step 1
     - `CLOUDFLARE_ACCOUNT_ID`: Your account ID from step 2

## Step 4: Verify Deployment

1. **Check Deployment Status**
   - Go to Cloudflare Dashboard → Workers & Pages → acm-media-platform
   - You should see your first deployment

2. **Test the Site**
   - Cloudflare will provide a URL like: `https://acm-media-platform.pages.dev`
   - Visit the URL to verify the site is working

3. **Check GitHub Actions**
   - Go to: https://github.com/chiltalk/acm-media-platform/actions
   - The "Deploy to Cloudflare Pages" workflow should be running or completed

## Step 5: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - In Cloudflare Dashboard → Pages → acm-media-platform
   - Click "Custom domains"
   - Click "Set up a custom domain"
   - Enter your domain (e.g., `acmmedia.com` or `www.acmmedia.com`)

2. **Update DNS**
   - If your domain is on Cloudflare, it will be configured automatically
   - Otherwise, add the CNAME record provided by Cloudflare to your DNS

3. **Enable SSL**
   - Cloudflare will automatically provision SSL certificates
   - Wait for the certificate to become active

## Troubleshooting

### Build Failures

If the build fails:
1. Check the build logs in Cloudflare Dashboard
2. Verify all environment variables are set
3. Ensure `npm run build` works locally
4. Check that the `.next` directory is being generated

### Environment Variables Not Working

1. Ensure variables are set in Production environment
2. Check for typos in variable names
3. Verify values don't have extra spaces or quotes
4. Restart the deployment after updating variables

### GitHub Actions Not Deploying

1. Verify secrets are correctly set in GitHub
2. Check the Actions tab for error messages
3. Ensure the workflow file exists at `.github/workflows/deploy.yml`
4. Verify API token has correct permissions

## Next Steps

After Cloudflare Pages is set up:

1. ✅ Create Supabase project
2. ✅ Run database migrations (see `DATABASE_SCHEMA.md`)
3. ✅ Test full application flow
4. ✅ Set up error monitoring (Sentry)
5. ✅ Configure analytics (optional)
6. ✅ Mark ACM-3 as complete

## Support

If you encounter issues:
- Check Cloudflare Pages documentation: https://developers.cloudflare.com/pages/
- Review Next.js on Cloudflare Pages: https://developers.cloudflare.com/pages/framework-guides/nextjs/
- Check GitHub Actions logs for detailed error messages