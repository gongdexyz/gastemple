const { exec } = require('child_process');
const fs = require('fs');

console.log('🔍 调试Bubblewrap构建...');

// 首先检查twa-manifest.json
if (!fs.existsSync('twa-manifest.json')) {
  console.error('❌ twa-manifest.json不存在');
  process.exit(1);
}

console.log('✅ twa-manifest.json存在');

// 运行构建命令并捕获所有输出
const cmd = 'npx @bubblewrap/cli build';
console.log(`运行: ${cmd}`);

const child = exec(cmd, { stdio: 'inherit' });

// 手动发送输入
setTimeout(() => {
  console.log('发送Y到标准输入...');
  child.stdin.write('Y\n');
}, 2000);

setTimeout(() => {
  console.log('发送y到标准输入...');
  child.stdin.write('y\n');
}, 4000);

child.on('close', (code) => {
  console.log(`构建进程退出，代码: ${code}`);
  
  // 检查生成的APK
  const apkFiles = [];
  
  function checkDir(dir) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = `${dir}/${file.name}`;
        if (file.isDirectory()) {
          checkDir(fullPath);
        } else if (file.name.endsWith('.apk')) {
          apkFiles.push(fullPath);
        }
      }
    }
  }
  
  checkDir('.');
  checkDir('android-build');
  
  if (apkFiles.length > 0) {
    console.log('✅ 找到APK文件:');
    apkFiles.forEach(f => console.log(`  - ${f}`));
  } else {
    console.log('❌ 未找到APK文件');
  }
  
  process.exit(code);
});