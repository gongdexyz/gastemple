@echo off
echo 🚀 开始构建APK (Package Name: xyz.gongde.gastemple)...

REM 检查dist目录
if not exist dist (
    echo ❌ dist目录不存在，请先运行: npm run build
    pause
    exit /b 1
)

echo ✅ dist目录存在

REM 启动本地服务器（后台）
echo 🌐 启动本地服务器...
start /B npx serve dist -p 8080

REM 等待服务器启动
timeout /t 5 /nobreak >nul

echo ✅ 本地服务器已启动: http://localhost:8080

REM 使用Bubblewrap构建
echo 🛠️ 使用Bubblewrap构建APK...
echo 注意：如果询问是否重新生成项目，输入 n
echo 注意：如果询问是否安装Android SDK，输入 Y
echo 注意：如果询问是否同意条款，输入 y

REM 创建输入文件
(
echo n
echo Y
echo y
) > input.txt

npx @bubblewrap/cli build < input.txt

REM 清理
del input.txt

REM 停止服务器
taskkill /f /im node.exe >nul 2>&1

echo.
echo 构建完成！
echo 检查生成的APK文件...
dir *.apk

pause