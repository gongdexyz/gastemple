@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    Gas Temple APK 本地构建
echo ========================================
echo.

echo [1/5] 备份 twa-manifest.json...
copy twa-manifest.json twa-manifest.backup.json >nul
echo ✅ 已备份

echo.
echo [2/5] 创建本地版本配置...
(
echo {
echo   "packageId": "com.gastemple.app",
echo   "host": "localhost:8080",
echo   "name": "Gas Temple - 功德无量",
echo   "launcherName": "Gas Temple",
echo   "display": "standalone",
echo   "themeColor": "#c9a962",
echo   "navigationColor": "#000000",
echo   "backgroundColor": "#0a0a0a",
echo   "enableNotifications": true,
echo   "startUrl": "/",
echo   "iconUrl": "http://localhost:8080/temple.svg",
echo   "maskableIconUrl": "http://localhost:8080/temple.svg",
echo   "monochromeIconUrl": "http://localhost:8080/temple.svg",
echo   "splashScreenFadeOutDuration": 300,
echo   "signingKey": {
echo     "alias": "android",
echo     "keyPassword": "android",
echo     "storePassword": "android"
echo   },
echo   "appVersionName": "1.0.0",
echo   "appVersionCode": 1,
echo   "shortcuts": [
echo     {
echo       "name": "开始抽卡",
echo       "shortName": "抽卡",
echo       "url": "/gacha",
echo       "chosenIconUrl": "http://localhost:8080/temple.svg"
echo     },
echo     {
echo       "name": "查看排行榜",
echo       "shortName": "排行榜",
echo       "url": "/leaderboard",
echo       "chosenIconUrl": "http://localhost:8080/temple.svg"
echo     }
echo   ],
echo   "generatorApp": "bubblewrap-cli",
echo   "webManifestUrl": "http://localhost:8080/manifest.json",
echo   "fallbackType": "customtabs",
echo   "features": {},
echo   "alphaDependencies": {
echo     "enabled": false
echo   },
echo   "enableSiteSettingsShortcut": true,
echo   "isChromeOSOnly": false,
echo   "isMetaQuest": false,
echo   "fullScopeUrl": "http://localhost:8080/",
echo   "minSdkVersion": 19,
echo   "orientation": "portrait",
echo   "fingerprints": [],
echo   "additionalTrustedOrigins": [],
echo   "retainedBundles": [],
echo   "appVersion": "1.0.0"
echo }
) > twa-manifest.json
echo ✅ 已创建本地配置

echo.
echo [3/5] 复制 manifest.json 到 dist...
copy public\manifest.json dist\manifest.json >nul
echo ✅ 已复制

echo.
echo [4/5] 启动本地服务器...
echo 提示: 服务器将在后台运行
start /B npx serve dist -p 8080
timeout /t 5 /nobreak >nul
echo ✅ 服务器已启动 (http://localhost:8080)

echo.
echo [5/5] 构建 APK...
echo.
echo 交互式输入提示:
echo - 是否应用更改? Yes 或直接回车
echo - versionName: 1.0.0
echo - versionCode: 1
echo - Key Store Password: android
echo - Key Password: android
echo.
pause
echo.

npx @bubblewrap/cli build --skipPwaValidation

echo.
echo [清理] 停止服务器并恢复配置...
taskkill /F /IM node.exe >nul 2>&1
copy twa-manifest.backup.json twa-manifest.json >nul
del twa-manifest.backup.json >nul
echo ✅ 已恢复原始配置

echo.
echo ========================================
echo    构建完成！
echo ========================================
echo.

if exist "app-release-signed.apk" (
    echo ✅ APK 文件: app-release-signed.apk
) else if exist "android-build\app\build\outputs\apk\release\app-release-signed.apk" (
    copy "android-build\app\build\outputs\apk\release\app-release-signed.apk" "gas-temple-release.apk"
    echo ✅ APK 文件: gas-temple-release.apk
) else (
    echo ⚠️ 未找到 APK 文件，请检查构建输出
)

echo.
pause
