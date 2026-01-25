@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    修复 Gradle 内存问题并构建 APK
echo ========================================
echo.

echo [1/6] 清理 Gradle 缓存...
if exist "%USERPROFILE%\.gradle\daemon" (
    rmdir /S /Q "%USERPROFILE%\.gradle\daemon"
    echo ✅ 已清理 Gradle daemon 缓存
) else (
    echo ℹ️ Gradle daemon 缓存不存在
)

echo.
echo [2/6] 创建全局 Gradle 配置（减少内存使用）...
if not exist "%USERPROFILE%\.gradle" mkdir "%USERPROFILE%\.gradle"
(
echo org.gradle.jvmargs=-Xmx512m -XX:MaxMetaspaceSize=256m -XX:+HeapDumpOnOutOfMemoryError
echo org.gradle.daemon=true
echo org.gradle.parallel=false
echo org.gradle.configureondemand=false
) > "%USERPROFILE%\.gradle\gradle.properties"
echo ✅ 已创建全局配置

echo.
echo [3/6] 备份并创建本地 twa-manifest.json...
copy twa-manifest.json twa-manifest.backup.json >nul 2>&1
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
echo [4/6] 复制 manifest.json 并启动服务器...
copy public\manifest.json dist\manifest.json >nul 2>&1
start /B npx serve dist -p 8080 >nul 2>&1
timeout /t 5 /nobreak >nul
echo ✅ 本地服务器已启动

echo.
echo [5/6] 构建 APK（使用减少的内存设置）...
echo.
echo 交互式输入提示:
echo - 是否应用更改? 直接按 Enter
echo - versionName: 1.0.0
echo - versionCode: 1  
echo - Key Store Password: android
echo - Key Password: android
echo.
pause

set GRADLE_OPTS=-Xmx512m -XX:MaxMetaspaceSize=256m
npx @bubblewrap/cli build --skipPwaValidation

echo.
echo [6/6] 清理...
taskkill /F /IM node.exe >nul 2>&1
if exist twa-manifest.backup.json (
    copy twa-manifest.backup.json twa-manifest.json >nul
    del twa-manifest.backup.json >nul
)
echo ✅ 已清理

echo.
echo ========================================
if exist "app-release-signed.apk" (
    echo ✅ 构建成功！
    echo APK 文件: app-release-signed.apk
) else if exist "android-build\app\build\outputs\apk\release\app-release-signed.apk" (
    copy "android-build\app\build\outputs\apk\release\app-release-signed.apk" "gas-temple-release.apk" >nul
    echo ✅ 构建成功！
    echo APK 文件: gas-temple-release.apk
) else (
    echo ⚠️ 构建可能失败，请检查上面的错误信息
)
echo ========================================
echo.
pause
