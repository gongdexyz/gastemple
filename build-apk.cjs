const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Gas Temple APK打包脚本开始...');

// 检查dist目录
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('❌ dist目录不存在，请先运行: npm run build');
  process.exit(1);
}

console.log('✅ dist目录存在');

// 检查manifest.json
const manifestPath = path.join(__dirname, 'public', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.log('❌ manifest.json不存在');
  process.exit(1);
}

console.log('✅ manifest.json存在');

// 复制manifest.json到dist目录
fs.copyFileSync(manifestPath, path.join(distPath, 'manifest.json'));
console.log('✅ 复制manifest.json到dist目录');

// 启动本地服务器
console.log('🌐 启动本地服务器...');
const server = spawn('npx', ['serve', 'dist', '-p', '8080'], {
  stdio: 'pipe',
  detached: true
});

// 等待服务器启动
setTimeout(() => {
  console.log('✅ 本地服务器已启动: http://localhost:8080');
  
  // 运行Bubblewrap初始化
  console.log('🛠️ 初始化Bubblewrap项目...');
  try {
    execSync('npx @bubblewrap/cli init --manifest=http://localhost:8080/manifest.json', {
      stdio: 'inherit',
      cwd: __dirname
    });
    console.log('✅ Bubblewrap初始化完成');
  } catch (error) {
    console.log('❌ Bubblewrap初始化失败:', error.message);
  }
  
  // 停止服务器
  server.kill();
  console.log('🛑 停止本地服务器');
  
  console.log('\n📱 下一步:');
  console.log('1. 检查生成的twa-manifest.json文件');
  console.log('2. 运行: npx @bubblewrap/cli build');
  console.log('3. 生成的APK文件: ./app-debug.apk');
  
}, 3000);

// 处理退出
process.on('SIGINT', () => {
  server.kill();
  process.exit();
});