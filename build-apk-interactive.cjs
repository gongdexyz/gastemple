const { spawn } = require('child_process');

console.log('🚀 开始构建APK...');

const bubblewrap = spawn('npx', ['@bubblewrap/cli', 'build'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let answeredFirst = false;
let answeredSecond = false;

bubblewrap.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // 检测到第一个问题
  if (output.includes('Do you want Bubblewrap to install the Android SDK') && !answeredFirst) {
    setTimeout(() => {
      bubblewrap.stdin.write('Y\n');
      answeredFirst = true;
      console.log('\n✅ 已选择安装Android SDK');
    }, 500);
  }
  
  // 检测到第二个问题
  if (output.includes('Do you agree to the Android SDK terms and conditions') && !answeredSecond) {
    setTimeout(() => {
      bubblewrap.stdin.write('y\n');
      answeredSecond = true;
      console.log('\n✅ 已同意Android SDK条款');
    }, 500);
  }
});

bubblewrap.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

bubblewrap.on('close', (code) => {
  console.log(`\n构建进程退出，代码: ${code}`);
  process.exit(code);
});

// 处理Ctrl+C
process.on('SIGINT', () => {
  bubblewrap.kill();
  process.exit();
});