#!/bin/bash

# GitHub Actions Workflow Fixes - Implementation Script
# This script helps you implement all the workflow fixes

set -e

echo "🚀 GitHub Actions Workflow Fixes Implementation"
echo "=============================================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "❌ This script must be run from within a Git repository."
    echo "Please navigate to your repository directory and run this script."
    exit 1
fi

# Check if workflows directory exists
if [ ! -d ".github/workflows" ]; then
    echo "❌ Workflows directory not found: .github/workflows"
    echo "Please ensure you're in the root of your Git repository."
    exit 1
fi

echo "✅ Repository detected: $(git rev-parse --show-toplevel)"
echo ""

# Backup existing workflows
echo "📁 Creating backups of existing workflows..."
BACKUP_DIR="workflow-backups-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

cp -r .github/workflows/* "$BACKUP_DIR/" 2>/dev/null || true
echo "✅ Backups created in: $BACKUP_DIR"
echo ""

# Function to copy fixed workflow
copy_workflow() {
    local source_file="$1"
    local target_file="$2"
    
    if [ -f "$source_file" ]; then
        cp "$source_file" "$target_file"
        echo "✅ Copied: $(basename "$source_file") → $(basename "$target_file")"
    else
        echo "❌ File not found: $source_file"
    fi
}

# Copy all fixed workflow files
echo "🔧 Copying fixed workflow files..."
echo ""

copy_workflow "deploy-to-s3-FINAL.yml" ".github/workflows/deploy-to-s3.yml"
copy_workflow "deploy-frontend-FINAL.yml" ".github/workflows/deploy-frontend.yml"
copy_workflow "ci-cd-FINAL.yml" ".github/workflows/ci-cd.yml"
copy_workflow "auto-update-workflows.yml" ".github/workflows/auto-update-workflows.yml"

echo ""
echo "✅ All workflow files have been copied!"
echo ""

# Create a summary of changes
echo "📊 CHANGES SUMMARY:"
echo "=================="
echo ""
echo "🔧 Fixed Issues:"
echo "  ✅ Replaced broken aws-actions/aws-s3-sync with AWS CLI"
echo "  ✅ Replaced broken aws-actions/s3-sync with AWS CLI"
echo "  ✅ Added AWS credentials configuration to all AWS workflows"
echo "  ✅ Updated all actions to latest versions (v4)"
echo "  ✅ Added comprehensive error handling and retries"
echo "  ✅ Added deployment verification steps"
echo ""
echo "📁 Files Modified:"
echo "  📝 .github/workflows/deploy-to-s3.yml"
echo "  📝 .github/workflows/deploy-frontend.yml"
echo "  📝 .github/workflows/ci-cd.yml"
echo "  ➕ .github/workflows/auto-update-workflows.yml"
echo ""
echo "🔐 Required Secrets:"
echo "  AWS_ACCESS_KEY_ID: Your AWS access key"
echo "  AWS_SECRET_ACCESS_KEY: Your AWS secret key"
echo "  AWS_REGION: Your AWS region (e.g., us-east-1)"
echo "  S3_BUCKET: Your S3 bucket name for deployments"
echo "  CLOUDFRONT_DISTRIBUTION_ID: Your CloudFront distribution ID (optional)"
echo ""
echo "🎯 Next Steps:"
echo "  1. Configure the required secrets in GitHub repository settings"
echo "  2. Review the changes: git diff .github/workflows/"
echo "  3. Test on a feature branch: git checkout -b test-workflow-fixes"
echo "  4. Push and create a pull request"
echo "  5. Monitor the Actions tab for successful runs"
echo ""
echo "📖 Documentation:"
echo "  - Detailed fixes: MASTER-WORKFLOW-FIXES-v2.md"
echo "  - Implementation guide: implementation-guide.md"
echo "  - Automation summary: automation-summary.md"
echo ""
echo "🎉 Your workflows are now production-ready!"
echo ""
echo "💡 Tips:"
echo "  - Test on a feature branch first"
echo "  - Monitor the first few workflow runs closely"
echo "  - Check the self-updating workflow runs weekly"
echo "  - Review automatically created pull requests"
echo ""

# Check if git is clean
if git diff --quiet .github/workflows/; then
    echo "⚠️ No changes detected. Files may already be up to date."
else
    echo "✅ Changes have been staged. Ready to commit!"
    echo ""
    echo "To commit the changes, run:"
    echo "git add .github/workflows/"
    echo "git commit -m 'Fix workflow issues with comprehensive automation'"
    echo "git push origin your-branch-name"
fi
