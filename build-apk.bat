@echo off
echo 🚀 开始构建APK...

REM 创建输入文件
echo Y > input.txt
echo y >> input.txt

REM 运行bubblewrap build并使用输入重定向
npx @bubblewrap/cli build < input.txt

REM 清理
del input.txt

echo.
echo 构建完成！
pause