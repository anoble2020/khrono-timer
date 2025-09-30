# Xcode Cloud Setup

This document explains the Xcode Cloud configuration for the Tabata Zen app.

## Files Added

### 1. `ci_scripts/ci_pre_xcodebuild.sh`
- **Purpose**: Installs CocoaPods dependencies before the build
- **What it does**:
  - Sets UTF-8 encoding to avoid Unicode issues
  - Installs CocoaPods if not available
  - Cleans existing Pods directory
  - Runs `pod install --repo-update --verbose`
  - Verifies that configuration files are generated

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

If you see the error:
```
Unable to open base configuration reference file '/Volumes/workspace/repository/ios/App/Pods/Target Support Files/Pods-App/Pods-App.release.xcconfig'
```

This means the pre-build script didn't run properly or CocoaPods installation failed. Check:

1. The `ci_scripts/ci_pre_xcodebuild.sh` file is committed to the repository
2. The script has execute permissions (`chmod +x`)
3. The script runs successfully in the Xcode Cloud logs

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
