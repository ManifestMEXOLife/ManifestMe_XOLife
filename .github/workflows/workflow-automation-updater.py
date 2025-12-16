#!/usr/bin/env python3
"""
GitHub Actions Workflow Automation Updater
Comprehensive tool to fix, update, and automate all workflow files
"""

import os
import re
import yaml
import requests
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import argparse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class WorkflowUpdater:
    """Main class for updating GitHub Actions workflows"""
    
    def __init__(self, workflows_dir: str = ".github/workflows"):
        self.workflows_dir = Path(workflows_dir)
        self.backup_dir = Path("workflow-backups")
        self.latest_versions = {}
        self.issues_found = []
        self.fixed_count = 0
        
        # Known broken actions and their fixes
        self.broken_actions = {
            'aws-actions/aws-s3-sync@v1': {
                'type': 'replace_with_cli',
                'replacement': 'aws s3 sync',
                'description': 'Replace with AWS CLI s3 sync command'
            },
            'aws-actions/s3-sync@v1': {
                'type': 'replace_with_cli', 
                'replacement': 'aws s3 sync',
                'description': 'Replace with AWS CLI s3 sync command'
            }
        }
        
        # Action version mappings for latest versions
        self.action_versions = {
            'actions/checkout': 'v4',
            'actions/setup-node': 'v4', 
            'actions/setup-python': 'v4',
            'actions/upload-artifact': 'v4',
            'actions/download-artifact': 'v4',
            'aws-actions/configure-aws-credentials': 'v4',
            'chetan/invalidate-cloudfront-action': 'v1',
            'appleboy/ssh-action': 'v0.1.7'
        }
    
    def check_latest_versions(self) -> Dict[str, str]:
        """Check latest versions of popular GitHub Actions"""
        logger.info("Checking latest versions of GitHub Actions...")
        
        # For this demo, we'll use predefined latest versions
        # In production, you could query the GitHub API
        latest_versions = {
            'actions/checkout': 'v4.1.1',
            'actions/setup-node': 'v4.0.2',
            'actions/setup-python': 'v5.0.0',
            'actions/upload-artifact': 'v4.3.1',
            'actions/download-artifact': 'v4.1.4',
            'aws-actions/configure-aws-credentials': 'v4.0.2',
            'chetan/invalidate-cloudfront-action': 'v1.4',
            'appleboy/ssh-action': 'v1.0.0'
        }
        
        return latest_versions
    
    def backup_workflows(self):
        """Create backups of all workflow files"""
        logger.info("Creating workflow backups...")
        
        self.backup_dir.mkdir(exist_ok=True)
        
        if not self.workflows_dir.exists():
            logger.error(f"Workflows directory not found: {self.workflows_dir}")
            return
            
        for workflow_file in self.workflows_dir.glob("*.yml"):
            backup_file = self.backup_dir / workflow_file.name
            try:
                with open(workflow_file, 'r') as src, open(backup_file, 'w') as dst:
                    dst.write(src.read())
                logger.info(f"Backed up: {workflow_file.name}")
            except Exception as e:
                logger.error(f"Failed to backup {workflow_file.name}: {e}")
    
    def analyze_workflow(self, file_path: Path) -> Dict:
        """Analyze a workflow file for issues"""
        issues = []
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                
            # Check for broken actions
            for broken_action, fix_info in self.broken_actions.items():
                if broken_action in content:
                    issues.append({
                        'type': 'broken_action',
                        'action': broken_action,
                        'fix': fix_info,
                        'severity': 'critical'
                    })
            
            # Check for outdated action versions
            for action, latest_version in self.action_versions.items():
                pattern = rf'{action}@v\d+(\.\d+)?'
                matches = re.finditer(pattern, content)
                for match in matches:
                    current_version = match.group(0)
                    if not current_version.endswith(f'@{latest_version}'):
                        issues.append({
                            'type': 'outdated_version',
                            'action': action,
                            'current': current_version,
                            'latest': f"{action}@{latest_version}",
                            'severity': 'medium'
                        })
            
            # Check for missing AWS credentials configuration
            if 'aws s3 sync' in content and 'aws-actions/configure-aws-credentials' not in content:
                issues.append({
                    'type': 'missing_aws_credentials',
                    'description': 'AWS CLI commands found but no AWS credentials configuration',
                    'severity': 'high'
                })
                
        except Exception as e:
            logger.error(f"Failed to analyze {file_path}: {e}")
            
        return {'file': file_path.name, 'issues': issues}
    
    def fix_workflow(self, file_path: Path, analysis: Dict) -> bool:
        """Fix issues in a workflow file"""
        logger.info(f"Fixing {file_path.name}...")
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
            
            original_content = content
            
            for issue in analysis['issues']:
                if issue['type'] == 'broken_action':
                    content = self.fix_broken_action(content, issue)
                elif issue['type'] == 'outdated_version':
                    content = self.fix_outdated_version(content, issue)
                elif issue['type'] == 'missing_aws_credentials':
                    content = self.add_aws_credentials(content)
            
            # Write the fixed content back
            if content != original_content:
                with open(file_path, 'w') as f:
                    f.write(content)
                logger.info(f"Fixed {file_path.name}")
                self.fixed_count += 1
                return True
            else:
                logger.info(f"No fixes needed for {file_path.name}")
                
        except Exception as e:
            logger.error(f"Failed to fix {file_path.name}: {e}")
            
        return False
    
    def fix_broken_action(self, content: str, issue: Dict) -> str:
        """Fix a broken action by replacing it with the correct implementation"""
        broken_action = issue['action']
        
        if 'aws-s3-sync' in broken_action or 's3-sync' in broken_action:
            # Add AWS credentials configuration if not present
            if 'aws-actions/configure-aws-credentials' not in content:
                aws_creds_step = """      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
"""
                # Find a good place to insert the AWS credentials step
                content = self.insert_aws_credentials_step(content, aws_creds_step)
            
            # Replace the broken action with AWS CLI command
            if 'deploy-to-s3.yml' in content or 'dist/' in content:
                replacement = """      - name: Sync to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} \
            --region us-east-1 \
            --delete \
            --acl public-read
"""
            else:  # deploy-frontend.yml or build/
                replacement = """      - name: Sync files to S3
        run: |
          aws s3 sync build/ s3://${{ secrets.S3_BUCKET }} \
            --region ${{ secrets.AWS_REGION }} \
            --delete
"""
            
            # Replace the broken action block
            pattern = rf'- name:.*?
\s+uses: {re.escape(broken_action)}.*?\n(?:\s+with:.*?\n(?:\s+\w+:.*?\n)*)?'
            content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            
        return content
    
    def insert_aws_credentials_step(self, content: str, aws_creds_step: str) -> str:
        """Insert AWS credentials step in the appropriate location"""
        # Find a good insertion point (after checkout/setup steps)
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'uses: actions/checkout@v' in line or 'uses: actions/setup-node@v' in line:
                # Find the end of this step block
                j = i + 1
                while j < len(lines) and (lines[j].startswith('      ') or not lines[j].strip()):
                    j += 1
                # Insert AWS credentials step after this
                lines.insert(j, aws_creds_step)
                break
        return '\n'.join(lines)
    
    def fix_outdated_version(self, content: str, issue: Dict) -> str:
        """Update an action to its latest version"""
        current = issue['current']
        latest = issue['latest']
        return content.replace(current, latest)
    
    def add_aws_credentials(self, content: str) -> str:
        """Add AWS credentials configuration to workflow"""
        aws_creds_step = """      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
"""
        return self.insert_aws_credentials_step(content, aws_creds_step)
    
    def generate_self_updater_workflow(self) -> str:
        """Generate a workflow that automatically updates other workflows"""
        return """name: Auto Update Workflows

on:
  schedule:
    # Run weekly on Sundays at 2 AM UTC
    - cron: '0 2 * * 0'
  workflow_dispatch:
    inputs:
      force_update:
        description: 'Force update all actions to latest versions'
        required: false
        default: 'false'
        type: choice
        options:
          - 'true'
          - 'false'

jobs:
  update-workflows:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: |
          pip install PyYAML requests
          
      - name: Run workflow updater
        run: |
          python workflow-automation-updater.py --auto-mode
          
      - name: Check for changes
        id: git-check
        run: |
          git diff --exit-code .github/workflows/ || echo "changes=true" >> $GITHUB_OUTPUT
          
      - name: Commit and push changes
        if: steps.git-check.outputs.changes == 'true'
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .github/workflows/
          git commit -m "Auto-update workflows: $(date -u +'%Y-%m-%d %H:%M:%S UTC')" || exit 0
          git push
          
      - name: Create pull request
        if: steps.git-check.outputs.changes == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "Auto-update workflows to latest versions"
          title: "🔄 Auto-update GitHub Actions workflows"
          body: |
            This PR was automatically generated by the workflow updater.
            
            Changes include:
            - Updated action versions to latest releases
            - Fixed any broken actions
            - Added missing configurations
            
            Please review the changes and merge if everything looks correct.
          branch: auto-update-workflows
          delete-branch: true
"""
    
    def create_comprehensive_report(self, analyses: List[Dict]) -> str:
        """Create a comprehensive report of all issues and fixes"""
        report = f"""# GitHub Actions Workflow Automation Report

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

- Total workflows analyzed: {len(analyses)}
- Issues found: {sum(len(a['issues']) for a in analyses)}
- Workflows fixed: {self.fixed_count}

## Issues by Type

"""
        
        issue_types = {}
        for analysis in analyses:
            for issue in analysis['issues']:
                issue_type = issue['type']
                if issue_type not in issue_types:
                    issue_types[issue_type] = []
                issue_types[issue_type].append({
                    'file': analysis['file'],
                    'issue': issue
                })
        
        for issue_type, issues in issue_types.items():
            report += f"\n### {issue_type.replace('_', ' ').title()}\n\n"
            for item in issues:
                report += f"- **{item['file']}**: {item['issue'].get('description', 'Issue found')}\n"
        
        report += """
## Fixed Workflows

The following workflows have been automatically fixed:

"""
        
        for analysis in analyses:
            if any(issue['severity'] == 'critical' for issue in analysis['issues']):
                report += f"- ✅ {analysis['file']} - Critical issues fixed\n"
        
        return report
    
    def run_full_analysis(self):
        """Run complete analysis and fix process"""
        logger.info("Starting comprehensive workflow analysis and update...")
        
        # Create backups
        self.backup_workflows()
        
        # Check latest versions
        self.latest_versions = self.check_latest_versions()
        
        # Analyze all workflows
        analyses = []
        if self.workflows_dir.exists():
            for workflow_file in self.workflows_dir.glob("*.yml"):
                if workflow_file.is_file():
                    analysis = self.analyze_workflow(workflow_file)
                    analyses.append(analysis)
                    
                    # Fix issues if found
                    if analysis['issues']:
                        self.fix_workflow(workflow_file, analysis)
        
        # Generate reports
        report = self.create_comprehensive_report(analyses)
        
        # Save report
        report_file = Path("/mnt/okcomputer/output/workflow-automation-report.md")
        with open(report_file, 'w') as f:
            f.write(report)
        
        # Create self-updater workflow
        updater_workflow = self.generate_self_updater_workflow()
        updater_file = Path("/mnt/okcomputer/output/auto-update-workflows.yml")
        with open(updater_file, 'w') as f:
            f.write(updater_workflow)
        
        logger.info(f"Analysis complete! Fixed {self.fixed_count} workflows.")
        logger.info(f"Report saved to: {report_file}")
        logger.info(f"Self-updater workflow saved to: {updater_file}")
        
        return analyses

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='GitHub Actions Workflow Updater')
    parser.add_argument('--workflows-dir', default='.github/workflows', 
                       help='Directory containing workflow files')
    parser.add_argument('--auto-mode', action='store_true', 
                       help='Run in automated mode (for CI/CD)')
    parser.add_argument('--backup-only', action='store_true', 
                       help='Only create backups without fixing')
    
    args = parser.parse_args()
    
    updater = WorkflowUpdater(args.workflows_dir)
    
    if args.backup_only:
        updater.backup_workflows()
        logger.info("Backups created successfully!")
    else:
        analyses = updater.run_full_analysis()
        
        if args.auto_mode:
            # In auto mode, exit with error code if critical issues were found
            critical_issues = sum(1 for analysis in analyses 
                                for issue in analysis['issues'] 
                                if issue['severity'] == 'critical')
            if critical_issues > 0:
                logger.error(f"Found {critical_issues} critical issues that need attention!")
                exit(1)
        
        logger.info("Workflow update process completed successfully!")

if __name__ == "__main__":
    main()
