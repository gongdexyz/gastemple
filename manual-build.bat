@echo off
echo 正在构建APK...
echo Y | npx @bubblewrap/cli build

if %errorlevel% equ 0 (
    echo 构建成功！
    echo 正在搜索APK文件...
    dir /s /b *.apk
) else (
    echo 构建失败，错误代码: %errorlevel%
)