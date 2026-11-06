#!/usr/bin/env node
// Secret scanner for pre-commit hook and manual tree scan
// Scans staged files (pre-commit) or entire tree (manual) for secrets
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Only .git is excluded for pre-commit; .git + node_modules for --all scan
const SKIP_DIRS_PRECOMMIT = ['.git'];
const SKIP_DIRS_ALL = ['.git', 'node_modules', '.10-Archive', '._АРХИВ'];

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return output.trim().split('\n').filter(f => f.length > 0);
  } catch (e) {
    console.error('Failed to get staged files:', e.message);
    process.exit(1);
  }
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!SKIP_DIRS_ALL.some(skip => filePath.includes(path.sep + skip + path.sep) || filePath.endsWith(path.sep + skip))) {
        getAllFiles(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function shouldSkip(filePath, scanAll) {
  const skipDirs = scanAll ? SKIP_DIRS_ALL : SKIP_DIRS_PRECOMMIT;
  return skipDirs.some(dir => filePath.includes(path.sep + dir + path.sep) || filePath.startsWith(dir + path.sep));
}

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  // Skip binary files
  const ext = path.extname(filePath).toLowerCase();
  const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.exe', '.dll', '.so', '.dylib', '.woff', '.woff2', '.ttf', '.eot', '.mp3', '.mp4', '.wav', '.avi', '.mov', '.zip', '.rar', '.7z', '.tar', '.gz', '.jar', '.keystore'];
  if (binaryExts.includes(ext)) {
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
  const scanAll = process.argv.includes('--all');
  let filesToScan;
  
  if (scanAll) {
    console.log('Scanning entire tree (except .git)...');
    filesToScan = getAllFiles('.');
  } else {
    filesToScan = getStagedFiles();
    if (filesToScan.length === 0) {
      console.log('No staged files to scan.');
      process.exit(0);
    }
  }
  
  let totalFindings = 0;
  let scannedCount = 0;
  
  for (const file of filesToScan) {
    if (shouldSkip(file, scanAll)) {
      continue;
    }
    
    const findings = scanFile(file);
    scannedCount++;
    
    if (findings.length > 0) {
      console.error(`\n❌ Secret detected in ${file}:`);
      for (const finding of findings) {
        console.error(`   ${finding.pattern}: ${finding.match}`);
        totalFindings++;
      }
    }
  }
  
  if (totalFindings > 0) {
    console.error(`\n🚫 ${scanAll ? 'Tree scan' : 'Commit'} blocked: ${totalFindings} secret(s) detected in ${scannedCount} file(s).`);
    console.error('   Remove secrets before committing.');
    process.exit(1);
  }
  
  console.log(`✓ Secret scan passed: ${scannedCount} file(s) scanned, 0 findings.`);
  process.exit(0);
}

main();
