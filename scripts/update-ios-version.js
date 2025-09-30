#!/usr/bin/env node

// Script to update iOS app version to match package.json
import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const projectPath = path.join(process.cwd(), 'ios/App/App.xcodeproj/project.pbxproj');

console.log('🔧 Updating iOS app version to match package.json...');

// Read package.json version
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const newVersion = packageJson.version;

console.log(`📦 Package.json version: ${newVersion}`);

// Read project.pbxproj file
let projectContent = fs.readFileSync(projectPath, 'utf8');

// Update MARKETING_VERSION
const marketingVersionRegex = /MARKETING_VERSION = [^;]+;/g;
const newMarketingVersion = `MARKETING_VERSION = ${newVersion};`;
projectContent = projectContent.replace(marketingVersionRegex, newMarketingVersion);

// Update CURRENT_PROJECT_VERSION (increment build number)
const currentVersionRegex = /CURRENT_PROJECT_VERSION = (\d+);/g;
const match = projectContent.match(currentVersionRegex);
let newBuild = 1;
if (match) {
  const currentBuild = parseInt(match[0].match(/\d+/)[0]);
  newBuild = currentBuild + 1;
  const newCurrentVersion = `CURRENT_PROJECT_VERSION = ${newBuild};`;
  projectContent = projectContent.replace(currentVersionRegex, newCurrentVersion);
  console.log(`📱 Build number: ${currentBuild} → ${newBuild}`);
}

// Write updated project file
fs.writeFileSync(projectPath, projectContent);

console.log(`✅ Updated iOS version to: ${newVersion}`);
console.log('📱 CFBundleShortVersionString will be:', newVersion);
console.log('📱 CFBundleVersion will be:', newBuild || 'incremented');

console.log('\n🚀 Next steps:');
console.log('1. Commit the updated project.pbxproj file');
console.log('2. Push to dev branch');
console.log('3. Create PR to main');
console.log('4. The iOS build will have the correct version!');
