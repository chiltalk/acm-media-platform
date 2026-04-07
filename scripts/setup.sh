#!/bin/bash

# ACM Media Platform - Local Development Setup Script
# This script helps set up the local development environment

set -e

echo "🚀 ACM Media Platform - Local Development Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Setting up environment variables..."

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Skipping creation."
else
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
        echo "⚠️  Please edit .env.local and add your Supabase credentials:"
        echo "   - NEXT_PUBLIC_SUPABASE_URL"
        echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    else
        echo "❌ .env.example not found. Please create .env.local manually."
    fi
fi

echo ""
echo "🎯 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Run the database setup script in Supabase SQL Editor:"
echo "   → See: supabase-setup.sql"
echo "3. Start the development server:"
echo "   → npm run dev"
echo ""
echo "For deployment, see: QUICK_DEPLOY.md"
echo ""