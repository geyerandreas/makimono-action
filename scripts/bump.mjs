#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const version = process.argv[2];

if (!version) {
  console.error('Usage: node scripts/bump.js <semver>');
  process.exit(1);
}

// Validate SemVer format
const semverRegex = /^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z-]+([.][0-9A-Za-z-]+)*)?$/;
if (!semverRegex.test(version)) {
  console.error(`Invalid SemVer: ${version}`);
  process.exit(1);
}

const rootDir = resolve(__dirname, '..');
const packageJsonPath = join(rootDir, 'package.json');
const readmePath = join(rootDir, 'README.md');

// Read current version from package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Update package.json
packageJson.version = version;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log(`✓ Updated package.json: ${currentVersion} → ${version}`);

// Update README.md
const readmeContent = readFileSync(readmePath, 'utf8');
const updatedReadme = readmeContent.split(currentVersion).join(version);
if (updatedReadme !== readmeContent) {
  writeFileSync(readmePath, updatedReadme);
  console.log(`✓ Updated README.md`);
} else {
  console.log(`ℹ No version references found in README.md`);
}
