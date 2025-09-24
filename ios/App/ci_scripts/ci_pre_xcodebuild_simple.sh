#!/bin/bash

# Simplified Xcode Cloud pre-build script
# This script ensures CocoaPods is properly installed and configured

set -e

echo "🔧 Setting up CocoaPods for Xcode Cloud..."

# Show environment info
echo "📁 Current directory: $(pwd)"
echo "📁 Working directory contents:"
ls -la

# Navigate to the parent directory (script runs from ci_scripts/)
cd ..

echo "📁 After cd .., current directory: $(pwd)"
echo "📁 Directory contents after cd ..:"
ls -la

# Check if CocoaPods is available
if command -v pod &> /dev/null; then
    echo "📦 CocoaPods is available: $(pod --version)"
else
    echo "📦 Installing CocoaPods..."
    gem install cocoapods
fi

# Check if Podfile exists
if [ -f "Podfile" ]; then
    echo "✅ Found Podfile in current directory"
else
    echo "❌ Could not find Podfile"
    echo "🔍 Searching for Podfile..."
    find . -name "Podfile" -type f 2>/dev/null || echo "No Podfile found"
    exit 1
fi

# Install pods
echo "📦 Installing CocoaPods dependencies..."
pod install

echo "✅ CocoaPods setup complete!"
