const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始APK初始化流程...');

// 检查manifest.json
const manifestPath = path.join(__dirname, 'public', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('❌ manifest.json不存在');
  process.exit(1);
}

console.log('✅ manifest.json存在');

// 使用spawn来处理交互式输入
const { spawn } = require('child_process');

const bubblewrap = spawn('npx', ['@bubblewrap/cli', 'init', '--manifest=./public/manifest.json'], {
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: true
});

// 发送回答
bubblewrap.stdin.write('Y\n'); // 安装Android SDK
setTimeout(() => {
  bubblewrap.stdin.write('y\n'); // 同意条款
}, 1000);

bubblewrap.on('close', (code) => {
  console.log(`Bubblewrap初始化退出码: ${code}`);
  if (code === 0) {
    console.log('✅ Bubblewrap初始化成功');
    // 检查生成的twa-manifest.json
    const twaManifestPath = path.join(__dirname, 'twa-manifest.json');
    if (fs.existsSync(twaManifestPath)) {
      console.log(`✅ twa-manifest.json已生成: ${twaManifestPath}`);
      // 读取并显示配置
      const twaManifest = JSON.parse(fs.readFileSync(twaManifestPath, 'utf8'));
      console.log('📋 APK配置:');
      console.log(`   包名: ${twaManifest.packageId}`);
      console.log(`   应用名称: ${twaManifest.name}`);
      console.log(`   版本: ${twaManifest.versionCode} (${twaManifest.versionName})`);
    }
  } else {
    console.log('❌ Bubblewrap初始化失败');
  }
});

// 超时处理
setTimeout(() => {
  console.log('⏰ 初始化超时');
  bubblewrap.kill();
}, 300000); // 5分钟超时