# Xcode Cloud Setup

This document explains the Xcode Cloud configuration for the Tabata Zen app.

## Files Added

### 1. `ci_scripts/ci_pre_xcodebuild.sh`
- **Purpose**: Full Capacitor build process for Xcode Cloud
- **What it does**:
  - Installs Node.js and npm dependencies
  - Handles peer dependency conflicts with HealthKit plugin
  - Builds the web app with `npm run build`
  - Copies web assets to iOS with `npx cap copy ios`
  - Installs CocoaPods dependencies
  - Cleans up temporary files

### 2. `ci_scripts/ci_post_xcodebuild.sh`
- **Purpose**: Post-build tasks (currently just logging)
- **Can be extended**: Add TestFlight upload, notifications, etc.

### 3. `.xcode-cloud.yml`
- **Purpose**: Xcode Cloud configuration file
- **Configures**: Build scheme, workspace, environment variables

## How It Works

1. **Xcode Cloud starts the build**
2. **Pre-build script runs**: Installs CocoaPods and dependencies
3. **Xcode builds the project**: Using the generated Pods configuration
4. **Post-build script runs**: Any cleanup or deployment tasks

## Troubleshooting

### Common Issues:

1. **CocoaPods Configuration Error:**
   ```
   Unable to open base configuration reference file '/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig'
   ```
   - **Solution**: The pre-build script didn't run properly. Check that `ci_scripts/ci_pre_xcodebuild.sh` is committed and has execute permissions.

2. **npm ERESOLVE Dependency Conflict:**
   ```
   npm error ERESOLVE could not resolve
   ```
   - **Solution**: The script now handles this automatically with `--legacy-peer-deps` and package.json overrides.

3. **HealthKit Plugin Compatibility:**
   - The script uses package.json overrides to force the correct Capacitor version for the HealthKit plugin
   - This resolves the peer dependency conflict without changing your actual dependencies

## Manual Testing

To test the setup locally:

```bash
# Make scripts executable
chmod +x ci_scripts/*.sh

# Run the pre-build script
./ci_scripts/ci_pre_xcodebuild.sh
```

## Dependencies

The app uses these CocoaPods dependencies:
- Capacitor (7.4.3)
- CapacitorCordova (7.4.3) 
- CapacitorSplashScreen (7.0.3)
- PerfoodCapacitorHealthkit (1.3.2)
