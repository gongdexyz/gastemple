@echo off
echo ========================================
echo DNS配置验证脚本 - gongde.xyz
echo ========================================
echo.

set DOMAIN=gongde.xyz

echo 1. 检查A记录（网站指向）:
nslookup %DOMAIN% 2>nul | findstr "Address"
echo.

echo 2. 检查MX记录（邮件路由）:
nslookup -type=MX %DOMAIN% 2>nul | findstr "mail"
echo.

echo 3. 检查TXT记录（SPF/DKIM）:
nslookup -type=TXT %DOMAIN% 2>nul | findstr "spf"
echo.

echo 4. 检查NS记录（域名服务器）:
nslookup -type=NS %DOMAIN% 2>nul | findstr "nameserver"
echo.

echo 5. 检查Cloudflare Email Routing MX记录:
echo   预期MX记录:
echo     route1.mx.cloudflare.net (优先级 38)
echo     route2.mx.cloudflare.net (优先级 78)
echo.

echo 6. 检查SPF记录:
echo   预期TXT记录:
echo     "v=spf1 include:_spf.mx.cloudflare.net ~all"
echo.

echo ========================================
echo 验证步骤:
echo 1. 确保MX记录指向Cloudflare
echo 2. 确保SPF记录正确
echo 3. 确保网站A记录正确
echo 4. 在Cloudflare Email Routing中验证目标邮箱
echo ========================================
echo.

echo 提示: 如果看到"找不到"或空白，表示DNS记录可能未设置或未传播。
echo DNS更改可能需要几分钟到几小时才能完全传播。
echo.

pause