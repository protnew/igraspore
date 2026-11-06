#!/usr/bin/env node
// Install git hooks for secret scanning
const fs = require('fs');
const path = require('path');

const HOOKS_DIR = path.resolve(__dirname, '..', '.git', 'hooks');
const PRE_COMMIT_HOOK = path.join(HOOKS_DIR, 'pre-commit');

const PRE_COMMIT_SCRIPT = `#!/bin/sh
# Pre-commit hook: scan for secrets
# Installed by tools/install_hooks.cjs

node tools/secret_scan.cjs
exit $?
`;

function main() {
  // Ensure hooks directory exists
  if (!fs.existsSync(HOOKS_DIR)) {
    fs.mkdirSync(HOOKS_DIR, { recursive: true });
  }
  
  // Write pre-commit hook
  fs.writeFileSync(PRE_COMMIT_HOOK, PRE_COMMIT_SCRIPT, { mode: 0o755 });
  
  console.log('✓ Pre-commit hook installed:', PRE_COMMIT_HOOK);
  console.log('  Scans for secrets before each commit.');
  console.log('  To bypass: git commit --no-verify (not recommended)');
}

main();
