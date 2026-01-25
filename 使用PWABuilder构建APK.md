# 使用 PWABuilder 构建 APK - 最简单方法

## 🚀 方法 1: PWABuilder 在线工具（推荐，最简单）

### 步骤 1: 部署网站

首先需要将你的应用部署到可访问的 URL。

**使用 Vercel 快速部署：**

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod
```

按提示操作后会得到一个 URL，例如：`https://gas-temple.vercel.app`

### 步骤 2: 使用 PWABuilder 生成 APK

1. **访问 PWABuilder**
   - 打开浏览器访问：https://www.pwabuilder.com/

2. **输入网站 URL**
   - 在首页输入框中输入你的网站 URL
   - 点击 "Start" 或 "Build My PWA"

3. **等待分析**
   - PWABuilder 会分析你的 PWA 配置
   - 检查 manifest.json 和 service worker

4. **选择 Android 平台**
   - 在平台选择页面，点击 "Android" 下的 "Store Package"

5. **配置 Android 设置**
   - **Package ID**: `com.gastemple.app`
   - **App name**: `Gas Temple`
   - **Launcher name**: `Gas Temple`
   - **Version**: `1.0.0`
   - **Version code**: `1`
   - 其他设置保持默认

6. **生成并下载 APK**
   - 点击 "Generate"
   - 等待生成完成（通常 1-2 分钟）
   - 下载生成的 APK 文件

## 🔧 方法 2: 本地构建（需要解决环境问题）

如果你想在本地构建，需要先解决 Java 环境：

### 安装 Java JDK

1. **下载 Java JDK 17**
   - 访问：https://adoptium.net/
   - 下载 Windows x64 版本的 JDK 17
   - 安装到默认位置

2. **设置环境变量**
   ```powershell
   # 在 PowerShell 中运行（以管理员身份）
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot", "Machine")
   ```

3. **验证安装**
   ```bash
   java -version
   ```

### 然后运行构建

```bash
# 确保 Web 应用已构建
npm run build

# 运行 Bubblewrap 构建
npx @bubblewrap/cli build --skipPwaValidation
```

**交互式输入：**
- 是否重新生成项目？输入 `n`
- versionName: `1.0.0`
- versionCode: `1`
- Key Store Password: `android`
- Key Password: `android`

## 📦 方法 3: 使用 GitHub Actions 自动构建

创建 `.github/workflows/build-apk.yml`：

```yaml
name: Build APK

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build web app
      run: npm run build
    
    - name: Build APK
      run: |
        npx @bubblewrap/cli build --skipPwaValidation
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: gas-temple-apk
        path: app-release-signed.apk
```

提交到 GitHub 后，在 Actions 标签页手动触发构建。

## ✅ 推荐方案

**最快速度：** 使用 PWABuilder（方法 1）
- 优点：无需配置环境，在线生成，5-10 分钟完成
- 缺点：需要先部署网站

**最灵活：** 本地构建（方法 2）
- 优点：完全控制，可以反复构建
- 缺点：需要配置 Java 环境

**最自动化：** GitHub Actions（方法 3）
- 优点：自动化，可重复，不占用本地资源
- 缺点：需要 GitHub 仓库

## 🎯 立即行动

**推荐流程：**

1. **部署网站**（必需）
   ```bash
   vercel --prod
   ```

2. **使用 PWABuilder 生成 APK**
   - 访问：https://www.pwabuilder.com/
   - 输入你的网站 URL
   - 下载 APK

3. **提交到 Solana dApp Store**
   - 使用生成的 APK
   - 填写表单信息

---

**下一步：** 运行 `vercel --prod` 部署网站
