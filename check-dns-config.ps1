# DNS配置验证脚本 - gongde.xyz
# PowerShell版本，提供更详细的检查

$Domain = "gongde.xyz"
$ExpectedMX = @(
    @{Server="route1.mx.cloudflare.net"; Priority=38},
    @{Server="route2.mx.cloudflare.net"; Priority=78}
)
$ExpectedSPF = "v=spf1 include:_spf.mx.cloudflare.net ~all"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DNS配置验证脚本 - $Domain" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查A记录
Write-Host "1. 检查A记录（网站指向）:" -ForegroundColor Yellow
try {
    $ARecords = Resolve-DnsName -Name $Domain -Type A -ErrorAction Stop
    foreach ($Record in $ARecords) {
        Write-Host "   $($Record.IPAddress)" -ForegroundColor Green
    }
} catch {
    Write-Host "   未找到A记录或查询失败" -ForegroundColor Red
}
Write-Host ""

# 2. 检查MX记录
Write-Host "2. 检查MX记录（邮件路由）:" -ForegroundColor Yellow
try {
    $MXRecords = Resolve-DnsName -Name $Domain -Type MX -ErrorAction Stop
    $MXFound = $false
    foreach ($Record in $MXRecords) {
        Write-Host "   $($Record.NameExchange) (优先级: $($Record.Preference))" -ForegroundColor Green
        $MXFound = $true
    }
    
    # 验证是否匹配Cloudflare Email Routing
    if ($MXFound) {
        Write-Host ""
        Write-Host "   Cloudflare Email Routing验证:" -ForegroundColor Yellow
        foreach ($Expected in $ExpectedMX) {
            $Found = $MXRecords | Where-Object { $_.NameExchange -eq $Expected.Server -and $_.Preference -eq $Expected.Priority }
            if ($Found) {
                Write-Host "   ✓ $($Expected.Server) (优先级: $($Expected.Priority)) - 正确" -ForegroundColor Green
            } else {
                Write-Host "   ✗ $($Expected.Server) (优先级: $($Expected.Priority)) - 未找到或配置错误" -ForegroundColor Red
            }
        }
    }
} catch {
    Write-Host "   未找到MX记录或查询失败" -ForegroundColor Red
}
Write-Host ""

# 3. 检查TXT记录
Write-Host "3. 检查TXT记录（SPF/DKIM）:" -ForegroundColor Yellow
try {
    $TXTRecords = Resolve-DnsName -Name $Domain -Type TXT -ErrorAction Stop
    $SPFFound = $false
    foreach ($Record in $TXTRecords) {
        $Strings = $Record.Strings -join ""
        Write-Host "   `"$Strings`"" -ForegroundColor Green
        
        # 检查SPF记录
        if ($Strings -like "*spf1*") {
            $SPFFound = $true
            if ($Strings -eq $ExpectedSPF) {
                Write-Host "   ✓ SPF记录正确" -ForegroundColor Green
            } else {
                Write-Host "   ⚠ SPF记录存在但不完全匹配" -ForegroundColor Yellow
                Write-Host "     预期: `"$ExpectedSPF`"" -ForegroundColor Gray
            }
        }
    }
    
    if (-not $SPFFound) {
        Write-Host "   ✗ 未找到SPF记录" -ForegroundColor Red
        Write-Host "     预期SPF记录: `"$ExpectedSPF`"" -ForegroundColor Gray
    }
} catch {
    Write-Host "   未找到TXT记录或查询失败" -ForegroundColor Red
}
Write-Host ""

# 4. 检查NS记录
Write-Host "4. 检查NS记录（域名服务器）:" -ForegroundColor Yellow
try {
    $NSRecords = Resolve-DnsName -Name $Domain -Type NS -ErrorAction Stop
    foreach ($Record in $NSRecords) {
        Write-Host "   $($Record.NameHost)" -ForegroundColor Green
    }
    
    # 检查是否使用Cloudflare Nameservers
    Write-Host ""
    Write-Host "   Nameserver验证:" -ForegroundColor Yellow
    $CloudflareNS = @("*.ns.cloudflare.com")
    $UsingCloudflare = $false
    foreach ($Record in $NSRecords) {
        if ($Record.NameHost -like "*.ns.cloudflare.com") {
            $UsingCloudflare = $true
            Write-Host "   ✓ 使用Cloudflare Nameservers: $($Record.NameHost)" -ForegroundColor Green
        }
    }
    
    if (-not $UsingCloudflare) {
        Write-Host "   ⚠ 未检测到Cloudflare Nameservers" -ForegroundColor Yellow
        Write-Host "     建议将nameservers更改为Cloudflare以使用Email Routing" -ForegroundColor Gray
    }
} catch {
    Write-Host "   未找到NS记录或查询失败" -ForegroundColor Red
}
Write-Host ""

# 5. 总结
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "配置总结" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$Checks = @()

# A记录检查
try {
    $ARecords = Resolve-DnsName -Name $Domain -Type A -ErrorAction SilentlyContinue
    $Checks += @{Name="A记录"; Status=($ARecords.Count -gt 0); Message="网站指向"}
} catch {
    $Checks += @{Name="A记录"; Status=$false; Message="未配置"}
}

# MX记录检查
try {
    $MXRecords = Resolve-DnsName -Name $Domain -Type MX -ErrorAction SilentlyContinue
    $HasCloudflareMX = $false
    foreach ($Expected in $ExpectedMX) {
        $Found = $MXRecords | Where-Object { $_.NameExchange -eq $Expected.Server -and $_.Preference -eq $Expected.Priority }
        if ($Found) { $HasCloudflareMX = $true }
    }
    $Checks += @{Name="MX记录"; Status=$HasCloudflareMX; Message="Cloudflare Email Routing"}
} catch {
    $Checks += @{Name="MX记录"; Status=$false; Message="未配置"}
}

# SPF记录检查
try {
    $TXTRecords = Resolve-DnsName -Name $Domain -Type TXT -ErrorAction SilentlyContinue
    $HasCorrectSPF = $false
    foreach ($Record in $TXTRecords) {
        $Strings = $Record.Strings -join ""
        if ($Strings -eq $ExpectedSPF) {
            $HasCorrectSPF = $true
        }
    }
    $Checks += @{Name="SPF记录"; Status=$HasCorrectSPF; Message="防垃圾邮件"}
} catch {
    $Checks += @{Name="SPF记录"; Status=$false; Message="未配置"}
}

# 显示检查结果
foreach ($Check in $Checks) {
    $StatusSymbol = if ($Check.Status) { "✓" } else { "✗" }
    $StatusColor = if ($Check.Status) { "Green" } else { "Red" }
    Write-Host "   $StatusSymbol $($Check.Name): $($Check.Message)" -ForegroundColor $StatusColor
}

Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Yellow
Write-Host "1. 如果所有检查都通过 ✓，配置完成" -ForegroundColor Green
Write-Host "2. 如果有 ✗ 标记，请参考 CLOUDFLARE_EMAIL_DNS_SETUP.md 进行配置" -ForegroundColor Yellow
Write-Host "3. DNS更改可能需要几分钟到几小时才能完全传播" -ForegroundColor Gray
Write-Host "4. 配置完成后，测试发送邮件到 contact@$Domain" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "脚本完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 保持窗口打开（如果双击运行）
if ($Host.Name -eq "ConsoleHost") {
    Write-Host "按任意键继续..."
    $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
}