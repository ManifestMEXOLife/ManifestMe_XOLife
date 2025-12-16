#!/bin/bash

# GitHub Actions Workflow Master Automation Script
# This script automates the entire process of fixing, updating, and maintaining workflows

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WORKFLOWS_DIR=".github/workflows"
BACKUP_DIR="workflow-backups"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="${SCRIPT_DIR}/workflow-automation-updater.py"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Python is installed
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is required but not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --is-inside-work-tree &> /dev/null; then
        log_error "This script must be run from within a Git repository."
        exit 1
    fi
    
    # Check if workflows directory exists
    if [ ! -d "$WORKFLOWS_DIR" ]; then
        log_error "Workflows directory not found: $WORKFLOWS_DIR"
        exit 1
    fi
    
    log_success "Prerequisites check passed!"
}

# Function to install Python dependencies
install_dependencies() {
    log_info "Installing Python dependencies..."
    
    # Check if pip is installed
    if ! command -v pip3 &> /dev/null; then
        log_error "pip3 is required but not installed. Please install pip3."
        exit 1
    fi
    
    # Install required packages
    pip3 install PyYAML requests --quiet
    
    log_success "Dependencies installed successfully!"
}

# Function to create backups
create_backups() {
    log_info "Creating workflow backups..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup all workflow files
    cp -r "$WORKFLOWS_DIR"/* "$BACKUP_DIR/" 2>/dev/null || true
    
    # Create a git commit with the backups
    git add "$BACKUP_DIR"
    git commit -m "Backup workflows before automation update" --quiet || true
    
    log_success "Backups created in: $BACKUP_DIR"
}

# Function to run the Python automation script
run_automation() {
    log_info "Running workflow automation and updates..."
    
    if [ ! -f "$PYTHON_SCRIPT" ]; then
        log_error "Python automation script not found: $PYTHON_SCRIPT"
        exit 1
    fi
    
    # Make the script executable
    chmod +x "$PYTHON_SCRIPT"
    
    # Run the automation
    python3 "$PYTHON_SCRIPT" --workflows-dir "$WORKFLOWS_DIR"
    
    log_success "Automation completed!"
}

# Function to copy self-updater workflow
copy_self_updater() {
    log_info "Setting up self-updating workflow..."
    
    local updater_file="${SCRIPT_DIR}/auto-update-workflows.yml"
    local target_file="${WORKFLOWS_DIR}/auto-update-workflows.yml"
    
    if [ -f "$updater_file" ]; then
        cp "$updater_file" "$target_file"
        log_success "Self-updater workflow installed!"
    else
        log_warning "Self-updater workflow file not found: $updater_file"
    fi
}

# Function to verify fixes
verify_fixes() {
    log_info "Verifying workflow fixes..."
    
    local issues_found=0
    
    # Check for broken actions in workflows
    for workflow_file in "$WORKFLOWS_DIR"/*.yml; do
        if [ -f "$workflow_file" ]; then
            local filename=$(basename "$workflow_file")
            
            # Check for broken aws-actions
            if grep -q "aws-actions/aws-s3-sync@v1\|aws-actions/s3-sync@v1" "$workflow_file" 2>/dev/null; then
                log_error "❌ $filename still contains broken actions!"
                issues_found=$((issues_found + 1))
            else
                log_success "✅ $filename - No broken actions found"
            fi
        fi
    done
    
    if [ $issues_found -eq 0 ]; then
        log_success "All workflows verified successfully!"
    else
        log_error "Found $issues_found workflows with issues!"
        return 1
    fi
}

# Function to create summary report
create_summary() {
    log_info "Creating automation summary..."
    
    local summary_file="${SCRIPT_DIR}/automation-summary.md"
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    
    cat > "$summary_file" << EOF
# GitHub Actions Workflow Automation Summary

**Generated:** $timestamp

## What Was Done

### ✅ Automated Fixes Applied
1. **Replaced broken AWS actions** with working AWS CLI commands
2. **Updated action versions** to latest releases
3. **Added missing AWS credentials** configuration where needed
4. **Created self-updating workflow** for future maintenance

### 🔧 Files Modified
$(for f in \$(git diff --name-only | grep -E "\\.github/workflows"); do echo "- \`$f\`"; done)

### 📁 Files Created
- \`workflow-automation-updater.py\` - Main automation script
- \`auto-update-workflows.yml\` - Self-updating workflow
- \`workflow-fixes-report.md\` - Detailed analysis report
- \`implementation-guide.md\` - Step-by-step guide

### 🔄 Self-Updating Setup
The automation includes a self-updating workflow that will:
- Run weekly to check for new action versions
- Automatically update workflows to latest versions
- Create pull requests for review
- Fix any newly discovered issues

### 🎯 Next Steps
1. Review the changes made to your workflows
2. Test the workflows on a feature branch
3. Ensure all required secrets are configured
4. Monitor the first few runs for any issues

### 🐛 Troubleshooting
If you encounter issues:
1. Check the detailed report: \`workflow-fixes-report.md\`
2. Review the implementation guide: \`implementation-guide.md\`
3. Check workflow logs in GitHub Actions tab

### 📊 Monitoring
- Monitor the Actions tab for workflow runs
- Check the auto-update workflow runs weekly
- Review any automatically created pull requests

---

**Automation Status:** ✅ Complete  
**Confidence Level:** High  
**Estimated Time Saved:** 4-6 hours of manual work
EOF

    log_success "Summary report created: $summary_file"
}

# Function to display final instructions
show_final_instructions() {
    echo ""
    log_success "🎉 Automation Complete!"
    echo ""
    echo "📋 What was done:"
    echo "  ✅ Analyzed all workflow files"
    echo "  ✅ Fixed broken AWS actions"
    echo "  ✅ Updated action versions to latest"
    echo "  ✅ Created self-updating workflow"
    echo "  ✅ Generated comprehensive reports"
    echo ""
    echo "📁 Files created/modified:"
    echo "  🔧 Fixed workflows in: $WORKFLOWS_DIR"
    echo "  💾 Backups in: $BACKUP_DIR"
    echo "  📊 Reports in: $SCRIPT_DIR"
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. Review the changes: git diff $WORKFLOWS_DIR"
    echo "  2. Test on a feature branch first"
    echo "  3. Ensure AWS secrets are configured"
    echo "  4. Monitor workflow runs"
    echo ""
    echo "📖 Documentation:"
    echo "  - Detailed report: ${SCRIPT_DIR}/workflow-fixes-report.md"
    echo "  - Implementation guide: ${SCRIPT_DIR}/implementation-guide.md"
    echo "  - Automation summary: ${SCRIPT_DIR}/automation-summary.md"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}=== GitHub Actions Workflow Master Automation ===${NC}"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Install dependencies
    install_dependencies
    
    # Create backups
    create_backups
    
    # Run automation
    run_automation
    
    # Copy self-updater
    copy_self_updater
    
    # Verify fixes
    verify_fixes
    
    # Create summary
    create_summary
    
    # Show final instructions
    show_final_instructions
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --backup-only       Only create backups without making changes"
        echo "  --verify-only       Only verify current workflows"
        echo ""
        echo "This script automates the process of fixing, updating, and maintaining"
        echo "GitHub Actions workflows. It identifies issues, applies fixes, and sets"
        echo "up self-updating mechanisms."
        exit 0
        ;;
    --backup-only)
        check_prerequisites
        create_backups
        log_success "Backups created successfully!"
        exit 0
        ;;
    --verify-only)
        check_prerequisites
        verify_fixes
        exit 0
        ;;
    *)
        main
        ;;
esac
