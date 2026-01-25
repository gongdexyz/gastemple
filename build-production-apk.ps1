#!/usr/bin/env pwsh
# Gas Temple - Production APK Build Script
# This script builds the APK for Solana dApp Store submission

Write-Host "🚀 Gas Temple Production APK Build" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if Java is installed (required for Android build)
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Java is not installed. Android SDK requires Java." -ForegroundColor Yellow
    Write-Host "   Please install Java JDK 11 or higher." -ForegroundColor Yellow
    Write-Host "   Download from: https://adoptium.net/" -ForegroundColor Yellow
}

# Check if Android SDK is available
$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
    Write-Host "⚠️  ANDROID_HOME environment variable is not set." -ForegroundColor Yellow
    Write-Host "   Bubblewrap will attempt to download Android SDK automatically." -ForegroundColor Yellow
}

Write-Host "✅ Prerequisites check completed" -ForegroundColor Green
Write-Host ""

# Step 2: Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "app-release-signed.apk") {
    Remove-Item "app-release-signed.apk" -Force
    Write-Host "   Removed old app-release-signed.apk" -ForegroundColor Gray
}
if (Test-Path "app-release-unsigned.apk") {
    Remove-Item "app-release-unsigned.apk" -Force
    Write-Host "   Removed old app-release-unsigned.apk" -ForegroundColor Gray
}
Write-Host "✅ Cleanup completed" -ForegroundColor Green
Write-Host ""

# Step 3: Build web app
Write-Host "🔨 Building web application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Web build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Web build completed" -ForegroundColor Green
Write-Host ""

# Step 4: Initialize Bubblewrap project (if needed)
Write-Host "🛠️  Checking Bubblewrap configuration..." -ForegroundColor Yellow
if (-not (Test-Path "twa-manifest.json")) {
    Write-Host "❌ twa-manifest.json not found. Please create it first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ TWA manifest found" -ForegroundColor Green
Write-Host ""

# Step 5: Build APK
Write-Host "📦 Building APK with Bubblewrap..." -ForegroundColor Yellow
Write-Host "   This may take several minutes..." -ForegroundColor Gray
Write-Host ""

npx @bubblewrap/cli build --skipPwaValidation

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ APK build failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Android SDK not installed - Bubblewrap will try to install it automatically" -ForegroundColor Gray
    Write-Host "2. Java not installed - Install Java JDK 11+ from https://adoptium.net/" -ForegroundColor Gray
    Write-Host "3. Network issues - Check your internet connection" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "✅ APK build completed successfully!" -ForegroundColor Green
Write-Host ""

# Step 6: Locate the APK
Write-Host "📱 Locating APK file..." -ForegroundColor Yellow
$apkPath = $null

# Check common locations
$possiblePaths = @(
    "app-release-signed.apk",
    "app-release-unsigned.apk",
    "android-build\app\build\outputs\apk\release\app-release-signed.apk",
    "android-build\app\build\outputs\apk\release\app-release-unsigned.apk"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $apkPath = $path
        break
    }
}

if ($apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "✅ APK found: $apkPath" -ForegroundColor Green
    Write-Host "   Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Gray
    Write-Host ""
    
    # Copy to root for easy access
    if ($apkPath -ne "gas-temple-release.apk") {
        Copy-Item $apkPath "gas-temple-release.apk" -Force
        Write-Host "✅ APK copied to: gas-temple-release.apk" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  APK file not found in expected locations" -ForegroundColor Yellow
    Write-Host "   Please check the build output above for the APK location" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🎉 Build Process Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Test the APK on an Android device" -ForegroundColor White
Write-Host "2. Verify all features work correctly" -ForegroundColor White
Write-Host "3. Prepare submission materials:" -ForegroundColor White
Write-Host "   - Publisher avatar (512x512 PNG)" -ForegroundColor Gray
Write-Host "   - App screenshots (1080x1920, 5 images)" -ForegroundColor Gray
Write-Host "   - Privacy policy URL: https://gongde.xyz/privacy-policy.html" -ForegroundColor Gray
Write-Host "   - EULA URL: https://gongde.xyz/eula.html" -ForegroundColor Gray
Write-Host "4. Submit to Solana Mobile dApp Store" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - Publisher Config: PUBLISHER_CONFIG.md" -ForegroundColor Gray
Write-Host "   - Compliance Check: COMPLIANCE_CHECK.md" -ForegroundColor Gray
Write-Host "   - Screenshots Guide: SCREENSHOTS_GUIDE.md" -ForegroundColor Gray
Write-Host ""
