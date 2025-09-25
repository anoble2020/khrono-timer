#!/bin/bash

# Xcode Cloud pre-build script for Capacitor apps
# This script ensures CocoaPods is properly installed and configured

set -e

echo "🔧 Setting up CocoaPods for Xcode Cloud..."

# Debug: Show current directory and contents
echo "📁 Current directory: $(pwd)"
echo "📁 Directory contents:"
ls -la

# Navigate to the repository root
# Script runs from ci_scripts/ so we need to go up to repo root
cd ../../..

echo "📁 After navigating to repo root, current directory: $(pwd)"
echo "📁 Directory contents:"
ls -la

# Check if package.json exists (indicates we're in the right place)
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found, not in repository root"
    exit 1
fi

echo "✅ Found package.json, in repository root"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    # Install Node.js using Homebrew (available in Xcode Cloud)
    brew install node
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found after Node.js installation"
    exit 1
fi

echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Build the web app
echo "🏗️ Building web app..."
npm run build

# Copy web assets to iOS
echo "📱 Copying web assets to iOS..."
npx cap copy ios

# Navigate to iOS App directory
cd ios/App
echo "📁 Now in iOS App directory: $(pwd)"
echo "📁 Directory contents:"
ls -la

# Check if Podfile exists
if [ ! -f "Podfile" ]; then
    echo "❌ Podfile not found in current directory"
    echo "🔍 Looking for Podfile in parent directories..."
    find . -name "Podfile" -type f 2>/dev/null || echo "No Podfile found"
    exit 1
fi

echo "✅ Found Podfile in current directory"

# Check if CocoaPods is installed
if ! command -v pod &> /dev/null; then
    echo "📦 Installing CocoaPods..."
    gem install cocoapods
fi

# Show CocoaPods version
echo "📦 CocoaPods version: $(pod --version)"

# Clean any existing Pods
echo "🧹 Cleaning existing Pods..."
rm -rf Pods/ || echo "No Pods directory to clean"
rm -rf Podfile.lock || echo "No Podfile.lock to clean"

# Force clean to ensure fresh install
echo "🧹 Force cleaning CocoaPods cache..."
pod cache clean --all || echo "Cache clean failed, continuing..."

# Update CocoaPods repo
echo "🔄 Updating CocoaPods repo..."
pod repo update

# Install pods
echo "📦 Installing CocoaPods dependencies..."
pod install

# If the build fails, try with verbose output
if [ $? -ne 0 ]; then
    echo "❌ Pod install failed, trying with verbose output..."
    pod install --verbose
fi

echo "✅ CocoaPods setup complete!"
