const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动交互式APK构建...');

// 使用正确的路径
const bubblewrapPath = path.join(__dirname, 'node_modules', '.bin', 'bubblewrap.cmd');
console.log(`使用路径: ${bubblewrapPath}`);

const bubblewrap = spawn(bubblewrapPath, ['build'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true  // 使用shell来避免路径问题
});

let answeredLicense = false;
let answeredRegenerate = false;

bubblewrap.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // 检测许可证接受提示
  if (output.includes('Accept? (y/N):') && !answeredLicense) {
    setTimeout(() => {
      bubblewrap.stdin.write('y\n');
      answeredLicense = true;
      console.log('\n✅ 已接受Android SDK许可证');
    }, 1000);
  }
  
  // 检测项目重新生成提示
  if (output.includes('then you may enter "no" (Y/n)') && !answeredRegenerate) {
    setTimeout(() => {
      bubblewrap.stdin.write('Y\n'); // 输入Y重新生成项目
      answeredRegenerate = true;
      console.log('\n✅ 已选择重新生成项目');
    }, 1000);
  }
});

bubblewrap.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

bubblewrap.on('close', (code) => {
  console.log(`\n构建进程退出，代码: ${code}`);
  
  // 搜索APK文件
  const fs = require('fs');
  
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
    console.log('\n❌ 未找到APK文件');
  }
  
  process.exit(code);
});

// 处理Ctrl+C
process.on('SIGINT', () => {
  bubblewrap.kill();
  process.exit();
});