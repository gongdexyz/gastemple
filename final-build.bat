@echo off
echo 🚀 最终APK构建尝试...
echo.

REM 创建输入文件
echo Y > input.txt
echo y >> input.txt

REM 运行构建
echo 正在运行Bubblewrap构建...
npx @bubblewrap/cli build < input.txt

REM 检查结果
if %errorlevel% equ 0 (
  echo ✅ 构建成功！
  echo.
  echo 搜索APK文件...
  dir /s /b *.apk
) else (
  echo ❌ 构建失败，错误代码: %errorlevel%
)

REM 清理
del input.txt 2>nul
pause