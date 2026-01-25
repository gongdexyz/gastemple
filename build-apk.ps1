Write-Host "🚀 开始构建APK..." -ForegroundColor Green

$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = "npx.cmd"
$processInfo.Arguments = "@bubblewrap/cli build"
$processInfo.RedirectStandardInput = $true
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.UseShellExecute = $false
$processInfo.CreateNoWindow = $true

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $processInfo

# 启动进程
$process.Start() | Out-Null

# 读取输出并自动回答
$answeredFirst = $false
$answeredSecond = $false

while (!$process.HasExited) {
    $line = $process.StandardOutput.ReadLine()
    if ($line -ne $null) {
        Write-Host $line
        
        # 检测第一个问题
        if ($line -match "Do you want Bubblewrap to install the Android SDK" -and !$answeredFirst) {
            Start-Sleep -Milliseconds 500
            $process.StandardInput.WriteLine("Y")
            $answeredFirst = $true
            Write-Host "✅ 已选择安装Android SDK" -ForegroundColor Green
        }
        
        # 检测第二个问题
        if ($line -match "Do you agree to the Android SDK terms and conditions" -and !$answeredSecond) {
            Start-Sleep -Milliseconds 500
            $process.StandardInput.WriteLine("y")
            $answeredSecond = $true
            Write-Host "✅ 已同意Android SDK条款" -ForegroundColor Green
        }
    }
    
    # 检查错误输出
    $errorLine = $process.StandardError.ReadLine()
    if ($errorLine -ne $null) {
        Write-Host $errorLine -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 100
}

# 读取剩余输出
$remainingOutput = $process.StandardOutput.ReadToEnd()
if ($remainingOutput) {
    Write-Host $remainingOutput
}

$remainingError = $process.StandardError.ReadToEnd()
if ($remainingError) {
    Write-Host $remainingError -ForegroundColor Red
}

$exitCode = $process.ExitCode
Write-Host "构建进程退出，代码: $exitCode" -ForegroundColor Cyan

exit $exitCode