const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Gas Temple - 本地 APK 构建');
console.log('=====================================\n');

// 创建临时的 twa-manifest.json 使用 localhost
const twaManifestPath = path.join(__dirname, 'twa-manifest.json');
const twaManifestBackupPath = path.join(__dirname, 'twa-manifest.backup.json');

// 备份原始文件
if (fs.existsSync(twaManifestPath)) {
  fs.copyFileSync(twaManifestPath, twaManifestBackupPath);
  console.log('✅ 已备份 twa-manifest.json');
}

// 创建本地版本的 manifest
const localManifest = {
  "packageId": "com.gastemple.app",
  "host": "localhost:8080",
  "name": "Gas Temple - 功德无量",
  "launcherName": "Gas Temple",
  "display": "standalone",
  "themeColor": "#c9a962",
  "navigationColor": "#000000",
  "backgroundColor": "#0a0a0a",
  "enableNotifications": true,
  "startUrl": "/",
  "iconUrl": "http://localhost:8080/temple.svg",
  "maskableIconUrl": "http://localhost:8080/temple.svg",
  "monochromeIconUrl": "http://localhost:8080/temple.svg",
  "splashScreenFadeOutDuration": 300,
  "signingKey": {
    "alias": "android",
    "keyPassword": "android",
    "storePassword": "android"
  },
  "appVersionName": "1.0.0",
  "appVersionCode": 1,
  "shortcuts": [
    {
      "name": "开始抽卡",
      "shortName": "抽卡",
      "url": "/gacha",
      "chosenIconUrl": "http://localhost:8080/temple.svg"
    },
    {
      "name": "查看排行榜",
      "shortName": "排行榜",
      "url": "/leaderboard",
      "chosenIconUrl": "http://localhost:8080/temple.svg"
    }
  ],
  "generatorApp": "bubblewrap-cli",
  "webManifestUrl": "http://localhost:8080/manifest.json",
  "fallbackType": "customtabs",
  "features": {},
  "alphaDependencies": {
    "enabled": false
  },
  "enableSiteSettingsShortcut": true,
  "isChromeOSOnly": false,
  "isMetaQuest": false,
  "fullScopeUrl": "http://localhost:8080/",
  "minSdkVersion": 19,
  "orientation": "portrait",
  "fingerprints": [],
  "additionalTrustedOrigins": [],
  "retainedBundles": [],
  "appVersion": "1.0.0"
};

fs.writeFileSync(twaManifestPath, JSON.stringify(localManifest, null, 2));
console.log('✅ 已创建本地版本的 twa-manifest.json\n');

// 确保 dist 目录存在
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('🔨 构建 Web 应用...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Web 构建完成\n');
}

// 复制 manifest.json 到 dist
const manifestSrc = path.join(__dirname, 'public', 'manifest.json');
const manifestDst = path.join(distPath, 'manifest.json');
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDst);
  console.log('✅ 已复制 manifest.json 到 dist\n');
}

// 启动本地服务器
console.log('🌐 启动本地服务器 (http://localhost:8080)...');
const server = spawn('npx', ['serve', 'dist', '-p', '8080'], {
  stdio: 'pipe',
  shell: true
});

let serverOutput = '';
server.stdout.on('data', (data) => {
  serverOutput += data.toString();
});

server.stderr.on('data', (data) => {
  serverOutput += data.toString();
});

// 等待服务器启动
setTimeout(() => {
  console.log('✅ 本地服务器已启动\n');
  
  console.log('📦 构建 APK...');
  console.log('   提示: 如果询问是否重新生成项目，输入 n');
  console.log('   提示: versionName 输入 1.0.0');
  console.log('   提示: versionCode 输入 1\n');
  
  try {
    execSync('npx @bubblewrap/cli build --skipPwaValidation', {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log('\n✅ APK 构建完成！\n');
    
    // 查找 APK
    const possiblePaths = [
      'app-release-signed.apk',
      'app-release-unsigned.apk',
      path.join('android-build', 'app', 'build', 'outputs', 'apk', 'release', 'app-release-signed.apk')
    ];
    
    let apkFound = false;
    for (const apkPath of possiblePaths) {
      if (fs.existsSync(apkPath)) {
        const stats = fs.statSync(apkPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`✅ APK 找到: ${apkPath} (${sizeMB} MB)`);
        
        const targetPath = 'gas-temple-release.apk';
        fs.copyFileSync(apkPath, targetPath);
        console.log(`✅ APK 已复制到: ${targetPath}\n`);
        apkFound = true;
        break;
      }
    }
    
    if (!apkFound) {
      console.log('⚠️  未找到 APK 文件\n');
    }
    
  } catch (error) {
    console.error('\n❌ APK 构建失败');
    console.error('错误:', error.message);
  } finally {
    // 停止服务器
    server.kill();
    console.log('🛑 已停止本地服务器');
    
    // 恢复原始 manifest
    if (fs.existsSync(twaManifestBackupPath)) {
      fs.copyFileSync(twaManifestBackupPath, twaManifestPath);
      fs.unlinkSync(twaManifestBackupPath);
      console.log('✅ 已恢复原始 twa-manifest.json\n');
    }
    
    console.log('=====================================');
    console.log('构建流程完成！');
    console.log('=====================================\n');
    
    if (apkFound) {
      console.log('⚠️  重要提示:');
      console.log('此 APK 使用 localhost 构建，仅用于测试。');
      console.log('提交到 Solana dApp Store 前，需要:');
      console.log('1. 部署网站到 https://gongde.xyz');
      console.log('2. 使用生产环境 URL 重新构建 APK\n');
    }
  }
}, 3000);

// 处理退出
process.on('SIGINT', () => {
  server.kill();
  if (fs.existsSync(twaManifestBackupPath)) {
    fs.copyFileSync(twaManifestBackupPath, twaManifestPath);
    fs.unlinkSync(twaManifestBackupPath);
  }
  process.exit();
});
