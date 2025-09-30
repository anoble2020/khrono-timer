#!/bin/bash

# Script to sync branches and manage the dev/main workflow

set -e

echo "🔄 Syncing branches..."

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Function to sync main to dev
sync_main_to_dev() {
    echo "📥 Syncing main to dev..."
    git checkout dev
    git pull origin dev
    git merge main
    git push origin dev
    echo "✅ Main synced to dev"
}

# Function to sync dev to main (via PR)
sync_dev_to_main() {
    echo "📤 Preparing dev for main..."
    git checkout dev
    git pull origin dev
    
    # Check if there are changes to push
    if git diff --quiet HEAD origin/main; then
        echo "ℹ️  No changes to sync from dev to main"
        return
    fi
    
    echo "🚀 Ready to create PR from dev to main"
    echo "Next steps:"
    echo "1. Go to GitHub and create a pull request from dev to main"
    echo "2. Review and merge the PR"
    echo "3. Run this script again to sync main back to dev"
}

# Main logic
case "$1" in
    "main-to-dev")
        sync_main_to_dev
        ;;
    "dev-to-main")
        sync_dev_to_main
        ;;
    "full-sync")
        sync_main_to_dev
        sync_dev_to_main
        ;;
    *)
        echo "Usage: $0 {main-to-dev|dev-to-main|full-sync}"
        echo ""
        echo "Commands:"
        echo "  main-to-dev  - Sync main branch changes to dev"
        echo "  dev-to-main  - Prepare dev for merging to main"
        echo "  full-sync    - Sync both directions"
        exit 1
        ;;
esac
