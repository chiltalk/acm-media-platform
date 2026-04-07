#!/bin/bash

# ACM Media Platform - Development Helper Script
# This script provides common development tasks

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛠️  ACM Media Platform - Development Helper${NC}"
echo "=============================================="
echo ""

# Function to show usage
show_help() {
    echo "Usage: ./scripts/dev.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  dev        Start development server"
    echo "  build      Build for production"
    echo "  lint       Run linter"
    echo "  type-check Run TypeScript type checking"
    echo "  clean      Clean build artifacts"
    echo "  install    Install dependencies"
    echo "  update     Update dependencies"
    echo "  help       Show this help message"
    echo ""
}

# Function to start dev server
dev_server() {
    echo -e "${GREEN}🚀 Starting development server...${NC}"
    echo "The site will be available at http://localhost:3000"
    echo ""
    npm run dev
}

# Function to build
build() {
    echo -e "${GREEN}🔨 Building for production...${NC}"
    npm run build
    echo -e "${GREEN}✅ Build complete!${NC}"
}

# Function to lint
lint() {
    echo -e "${GREEN}🔍 Running linter...${NC}"
    npm run lint
    echo -e "${GREEN}✅ Linting complete!${NC}"
}

# Function to type check
type_check() {
    echo -e "${GREEN}🔍 Running TypeScript type check...${NC}"
    npx tsc --noEmit
    echo -e "${GREEN}✅ Type check complete!${NC}"
}

# Function to clean
clean() {
    echo -e "${GREEN}🧹 Cleaning build artifacts...${NC}"
    rm -rf .next
    rm -rf node_modules/.cache
    echo -e "${GREEN}✅ Clean complete!${NC}"
}

# Function to install dependencies
install_deps() {
    echo -e "${GREEN}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed!${NC}"
}

# Function to update dependencies
update_deps() {
    echo -e "${GREEN}📦 Updating dependencies...${NC}"
    npm update
    echo -e "${YELLOW}⚠️  Please review the changes before committing${NC}"
    echo -e "${GREEN}✅ Dependencies updated!${NC}"
}

# Parse command
case "$1" in
    dev)
        dev_server
        ;;
    build)
        build
        ;;
    lint)
        lint
        ;;
    type-check)
        type_check
        ;;
    clean)
        clean
        ;;
    install)
        install_deps
        ;;
    update)
        update_deps
        ;;
    help|"")
        show_help
        ;;
    *)
        echo -e "${YELLOW}Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac