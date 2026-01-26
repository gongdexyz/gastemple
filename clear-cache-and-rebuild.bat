@echo off
echo ========================================
echo 清除缓存并重新构建
echo ========================================
echo.

echo 正在清理 node_modules/.vite 缓存...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo Vite 缓存已清除
)

echo.
echo 正在清理 dist 目录...
if exist dist (
    rmdir /s /q dist
    echo dist 目录已清除
)

echo.
echo ========================================
echo 正在重新构建...
echo ========================================
call npm run build

echo.
echo ========================================
echo 构建完成！
echo ========================================
echo.
echo 请按照以下步骤刷新浏览器：
echo 1. 按 Ctrl + Shift + R (Windows) 强制刷新
echo 2. 或按 F12 打开开发者工具
echo 3. 右键点击刷新按钮
echo 4. 选择"清空缓存并硬性重新加载"
echo.
echo ========================================
pause
