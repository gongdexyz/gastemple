import { spawn } from 'child_process';
import readline from 'readline';

console.log('🤖 智能APK构建...');

const bubblewrap = spawn('npx', ['@bubblewrap/cli', 'build'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

const rl = readline.createInterface({
  input: bubblewrap.stdout,
  crlfDelay: Infinity
});

let step = 0;

rl.on('line', (line) => {
  console.log(line);
  
  // 检测第一个问题
  if (line.includes('Do you want Bubblewrap to install the Android SDK')) {
    setTimeout(() => {
      bubblewrap.stdin.write('Y\n');
      console.log('✅ 发送: Y (安装Android SDK)');
    }, 1000);
  }
  
  // 检测许可证协议
  if (line.includes('Accept?')) {
    setTimeout(() => {
      bubblewrap.stdin.write('y\n');
      console.log('✅ 发送: y (接受许可证)');
    }, 1000);
  }
  
  // 检测构建完成
  if (line.includes('Build completed successfully') || line.includes('APK generated at')) {
    console.log('🎉 APK构建成功！');
  }
});

bubblewrap.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

bubblewrap.on('close', (code) => {
  console.log(`构建进程退出，代码: ${code}`);
  
  // 搜索APK文件
  const fs = require('fs');
  const path = require('path');
  
  function findApkFiles(dir) {
    let results = [];
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
    
    return results;
  }
  
  try {
    const apkFiles = findApkFiles('.');
    if (apkFiles.length > 0) {
      console.log('📱 找到APK文件:');
      apkFiles.forEach(file => console.log(`  - ${file}`));
    } else {
      console.log('❌ 未找到APK文件');
    }
  } catch (err) {
    console.log('⚠️ 搜索APK文件时出错:', err.message);
  }
  
  process.exit(code);
});