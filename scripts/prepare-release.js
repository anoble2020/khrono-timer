#!/usr/bin/env node

// Script to prepare a release from dev to main
// This script helps ensure a clean release process with automatic version bumping

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing release from dev to main...');

// Check if we're on the dev branch
const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
if (currentBranch !== 'dev') {
  console.error('❌ This script must be run from the dev branch');
  console.log('Current branch:', currentBranch);
  process.exit(1);
}

// Check for uncommitted changes
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.error('❌ You have uncommitted changes. Please commit or stash them first.');
    console.log('Uncommitted changes:');
    console.log(status);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error checking git status:', error.message);
  process.exit(1);
}

// Get current version
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

console.log('📦 Current version:', currentVersion);

// Function to increment version
function incrementVersion(type) {
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

function processRelease(version) {
  if (version !== currentVersion) {
    // Update version in package.json
    packageJson.version = version;
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json version to:', version);
  }
  
  // Run tests
  console.log('\n🧪 Running tests...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Tests passed');
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
  
  // Create release commit
  const commitMessage = `chore: prepare release v${version}`;
  execSync(`git add package.json`, { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  
  console.log('\n✅ Release preparation complete!');
  console.log('');
  console.log('📋 Release Summary:');
  console.log(`   Version: ${currentVersion} → ${version}`);
  console.log(`   Branch: ${currentBranch}`);
  console.log('');
  console.log('🚀 Next steps:');
  console.log('1. Push the dev branch: git push origin dev');
  console.log('2. Create a pull request from dev to main');
  console.log('3. Review and merge the PR');
  console.log('4. The release will be automatically created when merged to main');
  console.log('');
  console.log('💡 Quick commands:');
  console.log('   git push origin dev');
  console.log('   # Then create PR on GitHub');
}

// Main function to handle the release process
function main() {
  // Check for command line arguments
  const args = process.argv.slice(2);
  let versionType = null;

  if (args.includes('--major')) {
    versionType = 'major';
  } else if (args.includes('--minor')) {
    versionType = 'minor';
  } else if (args.includes('--patch')) {
    versionType = 'patch';
  } else if (args.includes('--custom')) {
    const customIndex = args.indexOf('--custom');
    if (customIndex + 1 < args.length) {
      versionType = 'custom';
      const customVersion = args[customIndex + 1];
      processRelease(customVersion);
      return;
    } else {
      console.error('❌ --custom requires a version number');
      process.exit(1);
    }
  }

  // If version type is specified via CLI, use it directly
  if (versionType && versionType !== 'custom') {
    const newVersion = incrementVersion(versionType);
    console.log(`✅ ${versionType} version bump: ${currentVersion} → ${newVersion}`);
    processRelease(newVersion);
    return;
  }

  // Interactive mode
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n📈 Version bump options:');
  console.log('1. major - Breaking changes (1.0.0 → 2.0.0)');
  console.log('2. minor - New features, backward compatible (1.0.0 → 1.1.0)');
  console.log('3. patch - Bug fixes, backward compatible (1.0.0 → 1.0.1)');
  console.log('4. custom - Enter custom version');
  console.log('5. skip - Keep current version');

  rl.question('\nSelect version bump type (1-5): ', (choice) => {
    let newVersion = currentVersion;
    
    switch (choice) {
      case '1':
        newVersion = incrementVersion('major');
        console.log(`✅ Major version bump: ${currentVersion} → ${newVersion}`);
        break;
      case '2':
        newVersion = incrementVersion('minor');
        console.log(`✅ Minor version bump: ${currentVersion} → ${newVersion}`);
        break;
      case '3':
        newVersion = incrementVersion('patch');
        console.log(`✅ Patch version bump: ${currentVersion} → ${newVersion}`);
        break;
      case '4':
        rl.question('Enter custom version: ', (customVersion) => {
          if (customVersion && customVersion !== currentVersion) {
            newVersion = customVersion;
            console.log(`✅ Custom version: ${currentVersion} → ${newVersion}`);
          }
          processRelease(newVersion);
        });
        return;
      case '5':
        console.log('⏭️  Keeping current version:', currentVersion);
        break;
      default:
        console.log('❌ Invalid choice, keeping current version');
        break;
    }
    
    processRelease(newVersion);
  });
}

// Run the main function
main();
