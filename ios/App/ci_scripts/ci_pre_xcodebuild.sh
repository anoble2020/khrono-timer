#!/bin/bash

# Xcode Cloud pre-build script for Capacitor apps
# This script ensures CocoaPods is properly installed and configured

set -e

echo "🔧 Setting up CocoaPods for Xcode Cloud..."

# Check if CocoaPods is installed
if ! command -v pod &> /dev/null; then
    echo "📦 Installing CocoaPods..."
    gem install cocoapods
fi

# Navigate to the iOS app directory
cd ios/App

# Clean any existing Pods
echo "🧹 Cleaning existing Pods..."
rm -rf Pods/
rm -rf Podfile.lock

# Install pods
echo "📦 Installing CocoaPods dependencies..."
pod install --repo-update

echo "✅ CocoaPods setup complete!"
