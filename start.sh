#!/bin/bash

# Stellar Loyalty Program - Quick Start Script

echo "🚀 Starting Stellar Loyalty Program..."
echo "===================================="

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20 or higher."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is too old. Using nvm to switch to Node 20..."
    nvm use 20 || nvm install 20
fi

# Navigate to client directory
cd client

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo "Please run ./deploy-easy.sh first to deploy the contract."
    exit 1
fi

# Display contract info
echo ""
echo "📋 Contract Configuration:"
cat .env.local
echo ""

# Start the development server
echo "🌐 Starting the development server..."
echo "👉 The app will be available at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

npm run dev 