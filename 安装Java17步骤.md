# 安装 Java 17 详细步骤

## 当前问题
你的系统仍在使用 Java 8，需要安装并切换到 Java 17。

## 🔧 解决方案

### 方法 1: 下载安装 Java 17（推荐）

#### 步骤 1: 下载 Java 17

1. **访问下载页面**
   - 打开浏览器访问：https://adoptium.net/temurin/releases/
   
2. **选择正确的版本**
   - Operating System: `Windows`
   - Architecture: `x64`
   - Package Type: `JDK`
   - Version: `17 - LTS`
   
3. **下载文件**
   - 点击 `.msi` 文件下载（例如：`OpenJDK17U-jdk_x64_windows_hotspot_17.0.x_x.msi`）

#### 步骤 2: 安装 Java 17

1. **运行安装程序**
   - 双击下载的 `.msi` 文件
   
2. **安装选项（重要！）**
   - ✅ **勾选** "Set JAVA_HOME variable"
   - ✅ **勾选** "JavaSoft (Oracle) registry keys"
   - ✅ **勾选** "Add to PATH"
   - 安装路径：使用默认路径（`C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\`）
   
3. **完成安装**
   - 点击"Install"
   - 等待安装完成

#### 步骤 3: 验证安装

**关闭所有 PowerShell/CMD 窗口，打开新窗口**

```bash
# 检查 Java 版本
java -version

# 应该显示类似：
# openjdk version "17.0.x" 2024-xx-xx
# OpenJDK Runtime Environment Temurin-17.0.x+x
```

### 方法 2: 使用 Chocolatey 安装（命令行方式）

如果你有 Chocolatey 包管理器：

```powershell
# 以管理员身份运行 PowerShell
choco install temurin17
```

### 方法 3: 手动配置环境变量（如果安装后版本仍不对）

#### 查找 Java 17 安装位置

```powershell
# 检查是否已安装 Java 17
dir "C:\Program Files\Eclipse Adoptium\"
# 或
dir "C:\Program Files\Java\"
```

#### 设置环境变量

**使用 PowerShell（需要管理员权限）：**

```powershell
# 以管理员身份运行 PowerShell

# 1. 设置 JAVA_HOME（替换为你的实际路径）
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot", "Machine")

# 2. 更新 PATH（将 Java 17 放在最前面）
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$newPath = "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot\bin;$currentPath"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")

# 3. 刷新环境变量（当前会话）
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot"
$env:Path = "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot\bin;$env:Path"
```

**使用图形界面：**

1. 按 `Win + R`，输入 `sysdm.cpl`，回车
2. 点击"高级"标签页
3. 点击"环境变量"
4. 在"系统变量"中：
   - 找到 `JAVA_HOME`，点击"编辑"
     - 变量值改为：`C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot`
   - 找到 `Path`，点击"编辑"
     - 将 `%JAVA_HOME%\bin` 移到最上面（或删除旧的 Java 路径）
5. 点击"确定"保存所有更改
6. **重启所有终端窗口**

### 方法 4: 临时使用 Java 17（快速测试）

如果你已经安装了 Java 17 但不想改系统环境变量：

```powershell
# 在当前 PowerShell 会话中临时设置
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

# 验证
java -version

# 然后在同一个窗口中构建 APK
npx @bubblewrap/cli build --skipPwaValidation
```

## 🔍 故障排查

### 问题 1: 安装后仍显示 Java 8

**原因：** PATH 中 Java 8 的路径在 Java 17 之前

**解决：**
1. 打开环境变量设置
2. 编辑 `Path` 变量
3. 将 Java 17 的路径移到最上面
4. 删除或禁用 Java 8 的路径
5. 重启终端

### 问题 2: 找不到 Java 17 安装目录

**检查常见位置：**
```powershell
# 检查这些目录
dir "C:\Program Files\Eclipse Adoptium\"
dir "C:\Program Files\Java\"
dir "C:\Program Files\OpenJDK\"
dir "C:\Program Files\AdoptOpenJDK\"
```

### 问题 3: 权限不足

**解决：** 以管理员身份运行 PowerShell
1. 右键点击 PowerShell
2. 选择"以管理员身份运行"
3. 重新执行命令

## ✅ 验证清单

完成安装后，验证以下内容：

```bash
# 1. Java 版本应该是 17.x
java -version

# 2. Java 编译器版本
javac -version

# 3. JAVA_HOME 应该指向 Java 17
echo %JAVA_HOME%

# 4. 所有命令都应该显示 17.x
```

## 🎯 下一步

验证 Java 17 安装成功后：

```bash
# 1. 确保 Web 应用已构建
npm run build

# 2. 构建 APK
npx @bubblewrap/cli build --skipPwaValidation
```

---

**如果遇到问题，请告诉我：**
1. 你是否已经下载并安装了 Java 17？
2. 运行 `java -version` 显示什么？
3. 运行 `echo %JAVA_HOME%` 显示什么？
