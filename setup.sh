#!/bin/bash

# SSA Inputs Parser - Setup Script
# This script helps you set up the project quickly

set -e

echo "🚀 SSA Inputs Parser - Setup Script"
echo "===================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check if pnpm is installed
echo "📦 Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing pnpm globally..."
    npm install -g pnpm
fi
echo "✅ pnpm version: $(pnpm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Build the project
echo "🔨 Building the project..."
pnpm build
echo "✅ Project built successfully"
echo ""

# Create logs directory if it doesn't exist
echo "📁 Setting up logs directory..."
mkdir -p logs
echo "✅ Logs directory ready"
echo ""

# Run tests
echo "🧪 Running tests..."
pnpm test
echo "✅ All tests passed"
echo ""

# Make bin files executable
echo "🔧 Setting up CLI..."
chmod +x bin/run.js bin/dev.js
echo "✅ CLI ready"
echo ""

# Link globally (optional)
echo "🔗 Would you like to link the CLI globally? (y/n)"
read -r LINK_GLOBAL

if [ "$LINK_GLOBAL" = "y" ] || [ "$LINK_GLOBAL" = "Y" ]; then
    echo "🔗 Linking CLI globally..."
    pnpm link --global
    echo "✅ CLI linked globally. You can now use 'ssa-parser' command"
    echo ""
    echo "Try: ssa-parser --help"
else
    echo "ℹ️  Skipping global link. Use './bin/run.js' to run the CLI"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Read the documentation: cat README.md"
echo "  2. Try an example: ssa-parser generate -i examples/simple-input.json -t examples/simple-template.tfvars -o output.tfvars"
echo "  3. Check out QUICKSTART.md for more information"
echo ""
echo "Happy parsing! 🚀"

