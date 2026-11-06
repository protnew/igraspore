#!/usr/bin/env node
// Secret scanner for pre-commit hook
// Scans staged files for password literals and other secrets
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Secret patterns
const PATTERNS = [
  { name: 'Password literal', regex: /igr[a-z0-9@#$_!.-]*123/i },
  { name: 'AWS key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'GitHub token', regex: /(ghp_|github_pat_)[a-zA-Z0-9_]{36,}/ },
  { name: 'GitLab token', regex: /glpat-[a-zA-Z0-9_-]{20,}/ },
  { name: 'Slack token', regex: /xox[baprs]-[a-zA-Z0-9-]+/ },
  { name: 'Google API key', regex: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'Private key', regex: /BEGIN (RSA |EC |DSA )?PRIVATE KEY/ },
  { name: 'Generic password', regex: /password\s*[:=]\s*['"][^'"]{8,}['"]/i },
  { name: 'Generic secret', regex: /secret\s*[:=]\s*['"][^'"]{8,}['"]/i },
  { name: 'Generic token', regex: /token\s*[:=]\s*['"][^'"]{16,}['"]/i },
];

// Files to skip
const SKIP_PATTERNS = [
  /\.git\//,
  /node_modules\//,
  /\.10-Archive\//,
  /_backups-tz-/,
  /secret_scan\.cjs$/, // Don't scan ourselves
];

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return output.trim().split('\n').filter(f => f.length > 0);
  } catch (e) {
    console.error('Failed to get staged files:', e.message);
    process.exit(1);
  }
}

function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
}

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const findings = [];
  
  for (const pattern of PATTERNS) {
    const matches = content.match(pattern.regex);
    if (matches) {
      findings.push({
        file: filePath,
        pattern: pattern.name,
        match: matches[0].substring(0, 50) + (matches[0].length > 50 ? '...' : ''),
      });
    }
  }
  
  return findings;
}

function main() {
  const stagedFiles = getStagedFiles();
  
  if (stagedFiles.length === 0) {
    console.log('No staged files to scan.');
    process.exit(0);
  }
  
  let totalFindings = 0;
  
  for (const file of stagedFiles) {
    if (shouldSkip(file)) {
      continue;
    }
    
    const findings = scanFile(file);
    
    if (findings.length > 0) {
      console.error(`\n❌ Secret detected in ${file}:`);
      for (const finding of findings) {
        console.error(`   ${finding.pattern}: ${finding.match}`);
        totalFindings++;
      }
    }
  }
  
  if (totalFindings > 0) {
    console.error(`\n🚫 Commit blocked: ${totalFindings} secret(s) detected.`);
    console.error('   Remove secrets before committing.');
    process.exit(1);
  }
  
  console.log(`✓ Secret scan passed: ${stagedFiles.length} file(s) scanned, 0 findings.`);
  process.exit(0);
}

main();
