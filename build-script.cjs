const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始APK构建过程...');

// 首先，确保twa-manifest.json使用正确的路径
const twaManifestPath = path.join(__dirname, 'twa-manifest.json');
let twaManifest = JSON.parse(fs.readFileSync(twaManifestPath, 'utf8'));

// 更新为相对路径
twaManifest.iconUrl = './public/temple.svg';
twaManifest.maskableIconUrl = './public/temple.svg';
twaManifest.monochromeIconUrl = './public/temple.svg';
twaManifest.webManifestUrl = './public/manifest.json';
twaManifest.fullScopeUrl = './dist/';

// 更新快捷方式图标
twaManifest.shortcuts.forEach(shortcut => {
  shortcut.chosenIconUrl = './public/temple.svg';
});

fs.writeFileSync(twaManifestPath, JSON.stringify(twaManifest, null, 2));
console.log('✅ 更新twa-manifest.json使用相对路径');

// 运行bubblewrap build
console.log('🛠️ 运行bubblewrap build...');
const bubblewrap = spawn('node_modules\\.bin\\bubblewrap.cmd', ['build'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

let step = 0;

bubblewrap.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // 处理各种提示
  if (output.includes('Accept? (y/N):') && step === 0) {
    setTimeout(() => {
      bubblewrap.stdin.write('y\n');
      step = 1;
      console.log('\n✅ 已接受Android SDK许可证');
    }, 1000);
  }
  
  if (output.includes('then you may enter "no" (Y/n)') && step === 1) {
    setTimeout(() => {
      bubblewrap.stdin.write('Y\n');
      step = 2;
      console.log('\n✅ 已选择重新生成项目');
    }, 1000);
  }
});

bubblewrap.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

bubblewrap.on('close', (code) => {
  console.log(`\n构建进程退出，代码: ${code}`);
  
  if (code === 0) {
    console.log('🎉 构建成功！');
    
    // 搜索APK文件
    function findApkFiles(dir) {
      let results = [];
      try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            results = results.concat(findApkFiles(fullPath));
          } else if (file.endsWith('.apk')) {
            results.push(fullPath);
          }
        }
      } catch (err) {
        // 忽略错误
      }
      
      return results;
    }
    
    const apkFiles = findApkFiles('.');
    if (apkFiles.length > 0) {
      console.log('\n📱 找到APK文件:');
      apkFiles.forEach(file => console.log(`  - ${file}`));
    } else {
      console.log('\n❌ 未找到APK文件，请检查构建输出');
    }
  } else {
    console.log('❌ 构建失败');
  }
  
  process.exit(code);
});

// 处理Ctrl+C
process.on('SIGINT', () => {
  bubblewrap.kill();
  process.exit();
});