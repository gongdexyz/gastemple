@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    Gas Temple APK 打包工具
echo ========================================
echo.

echo [1/3] 构建 Web 应用...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Web 构建失败
    pause
    exit /b 1
)

echo.
echo [2/3] 生成 APK...
echo 提示: 当询问版本信息时，请输入:
echo   - versionName: 1.0.0
echo   - versionCode: 1
echo.
call npx @bubblewrap/cli build --skipPwaValidation

echo.
echo [3/3] 查找生成的 APK...
if exist "app-release-signed.apk" (
    copy "app-release-signed.apk" "gas-temple-release.apk"
    echo ✅ APK 已复制到: gas-temple-release.apk
) else if exist "app-release-unsigned.apk" (
    copy "app-release-unsigned.apk" "gas-temple-release.apk"
    echo ✅ APK 已复制到: gas-temple-release.apk
) else (
    echo ⚠️ 未找到 APK 文件，请检查构建输出
)

echo.
echo ========================================
echo    构建完成！
echo ========================================
echo.
echo 下一步:
echo 1. 测试 APK: gas-temple-release.apk
echo 2. 查看提交指南: SOLANA_SUBMISSION_GUIDE.md
echo 3. 准备提交材料并提交到 Solana dApp Store
echo.
pause
