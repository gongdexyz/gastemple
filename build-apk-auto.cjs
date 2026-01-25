const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Gas Temple - Automated APK Build');
console.log('=====================================\n');

// Step 1: Build web app
console.log('🔨 Building web application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Web build completed\n');
} catch (error) {
  console.error('❌ Web build failed');
  process.exit(1);
}

// Step 2: Verify twa-manifest.json exists
console.log('📋 Checking TWA manifest...');
const twaManifestPath = path.join(__dirname, 'twa-manifest.json');
if (!fs.existsSync(twaManifestPath)) {
  console.error('❌ twa-manifest.json not found');
  process.exit(1);
}
console.log('✅ TWA manifest found\n');

// Step 3: Build APK with Bubblewrap
console.log('📦 Building APK with Bubblewrap...');
console.log('   This may take several minutes...\n');

try {
  // Use --skipPwaValidation to avoid PWA validation issues
  // The build command will use existing twa-manifest.json
  execSync('npx @bubblewrap/cli build --skipPwaValidation', {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('\n✅ APK build completed!\n');
  
  // Step 4: Find and report APK location
  console.log('📱 Locating APK file...');
  
  const possiblePaths = [
    'app-release-signed.apk',
    'app-release-unsigned.apk',
    path.join('android-build', 'app', 'build', 'outputs', 'apk', 'release', 'app-release-signed.apk'),
    path.join('android-build', 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk')
  ];
  
  let apkFound = false;
  for (const apkPath of possiblePaths) {
    const fullPath = path.join(__dirname, apkPath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✅ APK found: ${apkPath}`);
      console.log(`   Size: ${sizeMB} MB`);
      
      // Copy to root with a clear name
      const targetPath = path.join(__dirname, 'gas-temple-release.apk');
      fs.copyFileSync(fullPath, targetPath);
      console.log(`✅ APK copied to: gas-temple-release.apk\n`);
      apkFound = true;
      break;
    }
  }
  
  if (!apkFound) {
    console.log('⚠️  APK not found in expected locations');
    console.log('   Check the build output above for APK location\n');
  }
  
  console.log('=====================================');
  console.log('🎉 Build Process Complete!');
  console.log('=====================================\n');
  
  console.log('📋 Next Steps:');
  console.log('1. Test APK: gas-temple-release.apk');
  console.log('2. Prepare submission materials:');
  console.log('   - Publisher avatar (512x512 PNG)');
  console.log('   - App screenshots (check screenshots/ folder)');
  console.log('   - Privacy policy: https://gongde.xyz/privacy-policy.html');
  console.log('   - EULA: https://gongde.xyz/eula.html');
  console.log('3. Submit to Solana Mobile dApp Store\n');
  
  console.log('📚 Documentation:');
  console.log('   - PUBLISHER_CONFIG.md');
  console.log('   - COMPLIANCE_CHECK.md');
  console.log('   - SCREENSHOTS_GUIDE.md\n');
  
} catch (error) {
  console.error('\n❌ APK build failed');
  console.error('\nCommon issues:');
  console.error('1. Android SDK not installed - Bubblewrap will try to install it');
  console.error('2. Java not installed - Install Java JDK 11+ from https://adoptium.net/');
  console.error('3. Network issues - Check your internet connection');
  console.error('4. First-time setup - Bubblewrap may need to download dependencies\n');
  process.exit(1);
}
