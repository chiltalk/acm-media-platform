# ACM Media Platform

A modern content management and media platform built with Next.js 15, Supabase, and Cloudflare Pages.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Cloudflare Pages
- **CI/CD**: GitHub Actions
- **Error Tracking**: Sentry

## 📋 Features

- Content management system (CMS)
- Blog with author profiles
- Advanced search functionality
- Ad monetization integration
- Responsive design
- SEO optimized
- Real-time database with Supabase

## 🛠️ Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chiltalk/acm-media-platform.git
   cd acm-media-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # Or use the setup script
   ./scripts/setup.sh
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # Or use the dev helper script
   ./scripts/dev.sh dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development Scripts

The project includes helper scripts for common development tasks:

- `./scripts/setup.sh` - Initial setup and configuration
- `./scripts/dev.sh [command]` - Development helper
  - `dev` - Start development server
  - `build` - Build for production
  - `lint` - Run linter
  - `type-check` - Run TypeScript type check
  - `clean` - Clean build artifacts
  - `install` - Install dependencies
  - `update` - Update dependencies
- `./scripts/verify-deployment.sh [url]` - Verify deployment health

## 📚 Documentation

- **[Infrastructure Setup](INFRASTRUCTURE.md)** - Architecture overview and infrastructure details
- **[Database Schema](DATABASE_SCHEMA.md)** - Complete database structure and relationships
- **[Cloudflare Setup Guide](CLOUDFLARE_SETUP.md)** - Step-by-step deployment instructions

## 🚢 Deployment

### Automatic Deployment

The application automatically deploys to Cloudflare Pages when you push to the `main` branch via GitHub Actions.

### Manual Deployment

See [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) for detailed deployment instructions.

## 🏗️ Project Structure

```
acm-media-platform/
├── .github/
│   └── workflows/          # CI/CD workflows
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   └── lib/              # Utility functions and configurations
├── public/               # Static assets
├── .env.example          # Environment variables template
├── INFRASTRUCTURE.md     # Infrastructure documentation
├── DATABASE_SCHEMA.md    # Database schema documentation
└── CLOUDFLARE_SETUP.md   # Deployment guide
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build
```

## 🗄️ Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL scripts from [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
3. Enable Row Level Security (RLS) policies
4. Set up storage buckets for media uploads

## 🔒 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Sentry
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 👥 Team

- **CTO**: Agent 78a41381-9fb6-4908-bd58-6ab26fca8d4e
- **Senior Full-Stack Engineer**: Assigned to CMS, blog, and ad integration

## 📧 Support

For issues and questions, please use the GitHub issue tracker.

---

**Note**: This project is currently in active development. Infrastructure setup is in progress (see [ACM-3](https://github.com/chiltalk/acm-media-platform/issues/3)).