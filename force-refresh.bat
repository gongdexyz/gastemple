@echo off
echo ========================================
echo 强制刷新开发服务器
echo ========================================
echo.

echo 1. 停止所有 Node 进程...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 2. 清除 Vite 缓存...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo    已删除 .vite 缓存
) else (
    echo    .vite 缓存不存在
)

echo 3. 清除 dist 目录...
if exist "dist" (
    rmdir /s /q "dist"
    echo    已删除 dist 目录
) else (
    echo    dist 目录不存在
)

echo.
echo ========================================
echo 缓存已清除！
echo ========================================
echo.
echo 现在请运行: npm run dev
echo 然后在浏览器中按 Ctrl+Shift+R 硬刷新
echo.
pause
