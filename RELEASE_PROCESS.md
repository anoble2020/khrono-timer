# Release Process

This document outlines the release process for the Tabata Zen app using a `dev` → `main` workflow.

## Branch Structure

- **`dev`**: Primary development branch where all new features and fixes are developed
- **`main`**: Production-ready branch that triggers releases
- **`feature/*`**: Feature branches (optional, can work directly on dev)

## Release Workflow

### 1. Development on Dev Branch

All development happens on the `dev` branch:

```bash
# Switch to dev branch
git checkout dev

# Make your changes
# ... code changes ...

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to dev
git push origin dev
```

### 2. Preparing a Release

When you're ready to release, you have several options:

#### Interactive Release (Recommended)
```bash
# Make sure you're on dev branch
git checkout dev

# Run the interactive release script
npm run prepare-release
# or
node scripts/prepare-release.js
```

This will prompt you to select the version bump type:
- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes, backward compatible
- **Custom**: Enter any version number
- **Skip**: Keep current version

#### Quick Release Commands
```bash
# Patch release (bug fixes)
npm run release:patch

# Minor release (new features)
npm run release:minor

# Major release (breaking changes)
npm run release:major

# Custom version
node scripts/prepare-release.js --custom 1.2.3
```

#### What the Script Does
- Checks for uncommitted changes
- Automatically increments version in `package.json`
- Runs tests and build verification
- Creates a release commit
- Provides next steps for the release process

### 3. Creating a Release Pull Request

1. Push the dev branch:
   ```bash
   git push origin dev
   ```

2. Create a pull request from `dev` to `main`:
   - Go to GitHub
   - Click "New Pull Request"
   - Select `dev` → `main`
   - Fill out the PR template
   - Add reviewers if needed

3. Review the pull request:
   - Check that all tests pass
   - Review the changes
   - Ensure the release notes are accurate

4. Merge the pull request:
   - Use "Squash and merge" or "Merge commit"
   - This will trigger the release workflow

### 4. Automated Release

When the PR is merged to `main`, the following happens automatically:

1. **CI Pipeline** runs:
   - Linting and testing
   - Build verification
   - iOS build test

2. **Release Creation**:
   - New GitHub release is created
   - Changelog is generated from commits
   - iOS build artifacts are uploaded

3. **Xcode Cloud Build**:
   - iOS app is built and archived
   - Ready for TestFlight or App Store submission

## GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)
- Runs on every push to `main` and pull requests to `main`
- Includes linting, testing, and build verification
- Includes iOS build test for PRs and main branch
- Uses `--legacy-peer-deps` to handle HealthKit dependency conflicts

### Dev Check Workflow (`.github/workflows/dev-check.yml`)
- Runs on every push to `dev` branch
- Lightweight check: linting and build verification only
- No iOS build test (faster feedback)
- Uses `--legacy-peer-deps` to handle dependency conflicts

### Release Workflow (`.github/workflows/release.yml`)
- Runs when code is pushed to `main`
- Creates GitHub releases automatically
- Generates changelogs from git commits
- Builds and uploads iOS artifacts

### Dev Deploy Workflow (`.github/workflows/dev-deploy.yml`)
- Runs on every push to `dev` (can be manually triggered)
- Lightweight dev environment deployment
- Provides build status and version info
- Can be extended for staging deployments

## Version Management

Versions are managed in `package.json` and automatically updated by the release script.

### Semantic Versioning (SemVer)
We follow [Semantic Versioning](https://semver.org/) for version numbers: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes that are not backward compatible
  - API changes that break existing functionality
  - Removing features
  - Changing behavior in a way that affects existing users

- **MINOR** (1.0.0 → 1.1.0): New features that are backward compatible
  - Adding new features
  - Adding new API endpoints
  - Enhancing existing functionality

- **PATCH** (1.0.0 → 1.0.1): Bug fixes that are backward compatible
  - Fixing bugs
  - Performance improvements
  - Documentation updates

### Version Bump Guidelines

#### When to use MAJOR:
- Breaking changes to the API
- Removing deprecated features
- Changing the data format
- Requiring users to update their code

#### When to use MINOR:
- Adding new features
- Adding new configuration options
- Adding new API endpoints
- Enhancing existing features

#### When to use PATCH:
- Bug fixes
- Security patches
- Performance improvements
- Documentation updates
- Dependency updates

### Version Examples
```
Current: 1.2.3
Major:   2.0.0  (breaking changes)
Minor:   1.3.0  (new features)
Patch:   1.2.4  (bug fixes)
```

## Branch Protection Rules

It's recommended to set up branch protection rules for the `main` branch:

1. Go to GitHub → Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date
   - Include administrators

## Emergency Releases

For urgent fixes that need to go directly to main:

1. Create a hotfix branch from main:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/urgent-fix
   ```

2. Make the fix and commit:
   ```bash
   # ... make changes ...
   git add .
   git commit -m "fix: urgent fix for critical issue"
   ```

3. Create PR from hotfix to main
4. After merging, merge main back to dev:
   ```bash
   git checkout dev
   git merge main
   git push origin dev
   ```

## Release Checklist

Before creating a release:

- [ ] All tests pass locally
- [ ] Code is linted and formatted
- [ ] Documentation is updated if needed
- [ ] Version number is appropriate
- [ ] Release notes are prepared
- [ ] iOS build works correctly
- [ ] No breaking changes (or they're documented)

## Troubleshooting

### Build Failures
- Check GitHub Actions logs
- Ensure all dependencies are properly installed
- Verify iOS build configuration

### Release Issues
- Check that the release workflow has proper permissions
- Verify GitHub token has release creation rights
- Check for any workflow errors in the Actions tab

### Version Conflicts
- Ensure version numbers are unique
- Check that package.json is properly updated
- Verify git tags are created correctly
