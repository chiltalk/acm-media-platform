# Quick Deploy Guide - ACM Media Platform

Complete infrastructure deployment in ~45 minutes

---

## 🚀 One-Click Setup (After Manual Configuration)

Once you complete the manual setup below, deployments are automatic:
- Push to `main` branch → CI runs → Deploys to Cloudflare Pages

---

## 📋 Manual Setup Checklist

### Step 1: Cloudflare Pages (15 min)

**Get Credentials:**
```
1. https://dash.cloudflare.com/profile/api-tokens
2. Create token with "Edit Cloudflare Workers" permissions
3. Copy token → CLOUDFLARE_API_TOKEN
4. Copy Account ID from sidebar → CLOUDFLARE_ACCOUNT_ID
```

**Add GitHub Secrets:**
```
https://github.com/chiltalk/acm-media-platform/settings/secrets/actions
```
Add:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

**Connect Repository:**
```
1. https://dash.cloudflare.com/
2. Workers & Pages → Create application
3. Connect GitHub → Select acm-media-platform
4. Build: npm run build
5. Output: .next
6. Deploy!
```

**Add Environment Variables (in Cloudflare):**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Step 2: Supabase (10 min)

**Create Project:**
```
1. https://supabase.com → New project
2. Wait for provisioning (~2 min)
3. Copy credentials to Cloudflare env vars
```

**Run Setup Script:**
```
1. Go to SQL Editor
2. Copy contents of supabase-setup.sql
3. Run script
4. Verify: SELECT * FROM profiles;
```

**Create Storage Bucket:**
```
1. Storage → Create bucket
2. Name: media
3. Public bucket: Yes
4. Save
```

### Step 3: Test (5 min)

**Verify Deployment:**
```
1. Visit: https://acm-media-platform.pages.dev
2. Check GitHub Actions (green checkmark = success)
3. Test site loads without errors
4. Verify database connections work
```

---

## ✅ Success Indicators

- ✅ Site loads at Cloudflare Pages URL
- ✅ GitHub Actions shows green checkmark
- ✅ No console errors
- ✅ Database queries succeed
- ✅ Static assets load correctly

---

## 📊 Current Status

**Repository:** https://github.com/chiltalk/acm-media-platform
**Commits:** 13
**Status:** Ready for deployment
**Documentation:** Complete

**What's Ready:**
- ✅ Production-ready codebase
- ✅ CI/CD pipeline configured
- ✅ Database schema designed
- ✅ Setup scripts prepared
- ✅ Comprehensive documentation

**What's Needed:**
- 🚧 Cloudflare Pages connection (45 min)
- 🚧 Supabase project creation (10 min)

---

## 🔗 Quick Links

- **Repository:** https://github.com/chiltalk/acm-media-platform
- **Actions:** https://github.com/chiltalk/acm-media-platform/actions
- **Secrets:** https://github.com/chiltalk/acm-media-platform/settings/secrets/actions
- **Cloudflare:** https://dash.cloudflare.com/
- **Supabase:** https://supabase.com/

---

## 📚 Detailed Documentation

- **Complete Setup:** See CLOUDFLARE_SETUP.md
- **Database Schema:** See DATABASE_SCHEMA.md
- **Deployment Checklist:** See DEPLOYMENT_CHECKLIST.md
- **Infrastructure Status:** See INFRASTRUCTURE_STATUS.md
- **Database Script:** See supabase-setup.sql

---

## 🆘 Troubleshooting

**Build fails?**
- Check Cloudflare build logs
- Verify environment variables
- Ensure npm install succeeds

**Database errors?**
- Verify Supabase credentials
- Check RLS policies
- Run setup script again

**Images not loading?**
- Create storage bucket in Supabase
- Verify bucket is public
- Check RLS policies on storage

---

**Estimated Time:** 45 minutes
**Difficulty:** Medium
**Result:** Fully deployed ACM Media Platform

---

*Last updated: 2026-04-07*