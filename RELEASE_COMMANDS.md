# Release Commands Quick Reference

## Interactive Release (Recommended)
```bash
npm run prepare-release
```
Opens an interactive menu to select version bump type.

## Quick Release Commands

### Patch Release (Bug Fixes)
```bash
npm run release:patch
```
- Increments patch version (1.0.0 → 1.0.1)
- Use for: bug fixes, security patches, performance improvements

### Minor Release (New Features)
```bash
npm run release:minor
```
- Increments minor version (1.0.0 → 1.1.0)
- Use for: new features, enhancements, new API endpoints

### Major Release (Breaking Changes)
```bash
npm run release:major
```
- Increments major version (1.0.0 → 2.0.0)
- Use for: breaking changes, API changes, removing features

### Custom Version
```bash
node scripts/prepare-release.js --custom 1.2.3
```
- Sets a specific version number
- Use for: special releases, pre-releases, hotfixes

## What Happens After Running a Release Command

1. ✅ **Version Check**: Verifies you're on the `dev` branch
2. ✅ **Clean Check**: Ensures no uncommitted changes
3. ✅ **Version Bump**: Updates `package.json` with new version
4. ✅ **Tests**: Runs linting and build verification
5. ✅ **Commit**: Creates a release commit
6. ✅ **Push**: Pushes to `dev` branch (if using quick commands)
7. 📋 **Instructions**: Shows next steps for creating PR

## Next Steps After Release Command

1. **Create Pull Request**:
   - Go to GitHub
   - Create PR from `dev` → `main`
   - Use the PR template
   - Add reviewers

2. **Review and Merge**:
   - Review the changes
   - Ensure all checks pass
   - Merge the PR

3. **Automatic Release**:
   - GitHub Actions creates the release
   - iOS build is generated
   - Changelog is created

## Branch Management

### Sync Main to Dev
```bash
./scripts/sync-branches.sh main-to-dev
```

### Prepare Dev for Main
```bash
./scripts/sync-branches.sh dev-to-main
```

### Full Sync
```bash
./scripts/sync-branches.sh full-sync
```

## Troubleshooting

### Release Script Fails
- Check you're on `dev` branch: `git branch`
- Check for uncommitted changes: `git status`
- Run tests manually: `npm run lint && npm run build`

### Version Already Exists
- The script will prevent duplicate versions
- Use `--custom` to set a specific version
- Check existing versions: `git tag`

### Build Fails
- Check GitHub Actions logs
- Verify all dependencies are installed
- Test locally first: `npm run build`
