const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 快速构建APK...');

// 首先检查服务器是否运行
exec('powershell -Command "Test-NetConnection -ComputerName localhost -Port 8080 -InformationLevel Quiet"', (err, stdout, stderr) => {
  if (err) {
    console.log('❌ HTTP服务器未运行，正在启动...');
    // 启动服务器
    const server = exec('npx serve dist -p 8080', { detached: true });
    console.log('✅ HTTP服务器已启动');
    // 等待服务器启动
    setTimeout(() => {
      runBuild();
    }, 3000);
  } else {
    console.log('✅ HTTP服务器正在运行');
    runBuild();
  }
});

function runBuild() {
  console.log('📱 开始Bubblewrap构建...');
  
  // 使用echo自动回答所有问题
  const buildProcess = exec('echo Y | npx @bubblewrap/cli build', { stdio: 'inherit' });
  
  buildProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  buildProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  buildProcess.on('close', (code) => {
    console.log(`构建进程退出，代码: ${code}`);
    
    // 查找APK文件
    findApkFiles();
  });
}

function findApkFiles() {
  console.log('🔍 搜索APK文件...');
  
  function search(dir) {
    let results = [];
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = require('path').join(dir, file);
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            results = results.concat(search(fullPath));
          } else if (file.endsWith('.apk')) {
            results.push(fullPath);
          }
        } catch (e) {
          // 忽略错误
        }
      }
    } catch (err) {
      // 忽略错误
    }
    
    return results;
  }
  
  const apkFiles = search('.');
  if (apkFiles.length > 0) {
    console.log('\n✅ 找到APK文件:');
    apkFiles.forEach(file => {
      const stats = fs.statSync(file);
      console.log(`  - ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    });
  } else {
    console.log('\n❌ 未找到APK文件');
  }
  
  process.exit(0);
}