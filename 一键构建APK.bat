@echo off
chcp 65001 >nul
title Gas Temple APK 构建

echo.
echo ========================================
echo    Gas Temple APK 一键构建
echo ========================================
echo.

:: 设置 Gradle 内存限制
set GRADLE_OPTS=-Xmx256m -XX:MaxMetaspaceSize=128m

:: 复制 manifest.json 到 dist
echo [1/4] 准备文件...
copy public\manifest.json dist\manifest.json >nul 2>&1
copy public\temple.svg dist\temple.svg >nul 2>&1
echo OK

:: 启动本地服务器
echo [2/4] 启动本地服务器...
start /B cmd /c "npx serve dist -p 8080 -n"
timeout /t 5 /nobreak >nul
echo OK - http://localhost:8080

:: 构建 APK
echo [3/4] 构建 APK...
echo.
echo ----------------------------------------
echo 请按以下方式回答问题:
echo - Apply changes? 按 Enter (Yes)
echo - versionName: 输入 1.0.0
echo - versionCode: 按 Enter
echo - Key Store Password: 输入 android
echo - Key Password: 输入 android
echo ----------------------------------------
echo.

call npx @bubblewrap/cli build --skipPwaValidation

echo.
echo [4/4] 查找 APK 文件...

if exist "app-release-signed.apk" (
    echo.
    echo ========================================
    echo ✅ 构建成功！
    echo APK 文件: app-release-signed.apk
    echo ========================================
) else if exist "app-release-unsigned.apk" (
    echo.
    echo ========================================
    echo ✅ 构建成功！
    echo APK 文件: app-release-unsigned.apk
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ⚠️ 请检查上面的输出信息
    echo ========================================
)

:: 停止服务器
taskkill /F /IM node.exe >nul 2>&1

echo.
pause
