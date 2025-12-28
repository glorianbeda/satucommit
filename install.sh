#!/bin/bash

# satucommit Installation Script
# This script installs the satucommit CLI tool globally

set -e

echo "🚀 Installing satucommit..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Make CLI executable
echo "🔧 Making CLI executable..."
chmod +x cli.js

# Install globally
echo "📦 Installing globally..."
npm link

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 Initializing satucommit for AI agent slash command support..."
node cli.js init
echo ""
echo "� Usage:"
echo "  satucommit generate     - Generate a semantic commit message"
echo "  satucommit quick        - Quick commit with auto-generated message"
echo "  satucommit interactive  - Interactive mode to build commit message"
echo "  satucommit types        - Show available commit types"
echo "  satucommit scopes       - Show common commit scopes"
echo ""
echo "📖 For more information, run: satucommit --help"
echo ""
