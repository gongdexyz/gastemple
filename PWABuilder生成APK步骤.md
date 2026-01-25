# 使用 PWABuilder 生成 APK - 详细步骤

## 🚀 步骤 1: 部署网站到 Vercel

### 安装并登录 Vercel

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录（会打开浏览器）
vercel login

# 3. 部署到生产环境
vercel --prod
```

### 部署过程中的问题回答

```
? Set up and deploy "G:\gastemple"? [Y/n]
输入: Y

? Which scope do you want to deploy to?
选择: 你的账号名称

? Link to existing project? [y/N]
输入: N

? What's your project's name?
输入: gas-temple （或其他名称）

? In which directory is your code located?
输入: ./ （当前目录）

? Want to override the settings? [y/N]
输入: N （使用默认设置）
```

### 部署成功后

你会看到类似的输出：
```
✅  Production: https://gas-temple.vercel.app [copied to clipboard]
```

**记下这个 URL！** 例如：`https://gas-temple.vercel.app`

---

## 🎨 步骤 2: 使用 PWABuilder 生成 APK

### 2.1 访问 PWABuilder

打开浏览器，访问：**https://www.pwabuilder.com/**

### 2.2 输入网站 URL

1. 在首页的输入框中输入你刚才获得的 Vercel URL
   - 例如：`https://gas-temple.vercel.app`
2. 点击 **"Start"** 或 **"Package For Stores"** 按钮

### 2.3 等待分析

PWABuilder 会分析你的网站：
- ✅ 检查 manifest.json
- ✅ 检查 Service Worker
- ✅ 检查 PWA 配置

分析完成后会显示你的应用信息和评分。

### 2.4 选择 Android 平台

1. 在平台选择页面，找到 **"Android"** 部分
2. 点击 **"Store Package"** 或 **"Generate"** 按钮

### 2.5 配置 Android 应用信息

填写以下信息：

**Package options:**
- **Package ID**: `com.gastemple.app`
- **App name**: `Gas Temple`
- **Launcher name**: `Gas Temple`
- **App version**: `1.0.0`
- **App version code**: `1`
- **Host**: `gas-temple.vercel.app` （你的域名，不含 https://）
- **Start URL**: `/`

**Signing key:**
- **Key alias**: `android`
- **Key password**: `android`
- **Store password**: `android`

或者选择：
- ✅ **"Generate new signing key"** - 让 PWABuilder 自动生成

**Display mode:**
- 选择：`standalone`

**Theme color:**
- 输入：`#c9a962`

**Background color:**
- 输入：`#0a0a0a`

**Icon:**
- 使用默认（PWABuilder 会从 manifest.json 自动获取）

### 2.6 生成 APK

1. 检查所有配置信息
2. 点击 **"Build My Package"** 或 **"Generate"** 按钮
3. 等待生成（通常 1-3 分钟）

### 2.7 下载 APK

生成完成后：
1. 点击 **"Download"** 按钮
2. 会下载一个 `.zip` 文件（例如：`gas-temple-android.zip`）
3. 解压 zip 文件
4. 找到 `.apk` 文件（通常在 `app-release-signed.apk` 或类似名称）

---

## 📦 步骤 3: 验证 APK

### 3.1 检查 APK 文件

解压后的文件结构：
```
gas-temple-android/
├── app-release-signed.apk  ← 这是你需要的 APK 文件
├── assetlinks.json
├── signing-key.keystore
└── README.md
```

### 3.2 重命名 APK（可选）

将 `app-release-signed.apk` 重命名为 `gas-temple-release.apk`

---

## 🎯 步骤 4: 提交到 Solana dApp Store

现在你有了 APK 文件，可以提交到 Solana dApp Store 了！

### 提交信息填写

参考之前创建的 `Solana提交表单填写指南.md`：

**基本信息：**
- dApp名称: `Gas Temple - 功德无量`
- 软件包名称: `com.gastemple.app`
- 名言: `既然都要亏，不如亏得好笑一点`
- 描述: （使用指南中的完整描述）

**文件上传：**
- APK: `gas-temple-release.apk`
- 截图: `screenshots/` 目录中的 5 张图片
- 应用图标: `public/temple.svg` 转换为 PNG

**发布者信息：**
- Publisher Name: `Gas Temple Studio`
- Website: `https://gas-temple.vercel.app` （你的 Vercel URL）
- Email: 你的联系邮箱

**法律文件：**
- Privacy Policy: `https://gas-temple.vercel.app/privacy-policy.html`
- EULA: `https://gas-temple.vercel.app/eula.html`

---

## ⚠️ 常见问题

### Q: PWABuilder 显示 "PWA not found" 或分析失败

**原因：** manifest.json 或 service worker 配置问题

**解决：**
1. 确保网站已成功部署
2. 访问 `https://你的域名/manifest.json` 确认可以访问
3. 检查 manifest.json 格式是否正确

### Q: 生成的 APK 无法安装

**原因：** 签名问题或配置错误

**解决：**
1. 使用 PWABuilder 的自动签名功能
2. 确保 Package ID 格式正确（`com.gastemple.app`）

### Q: APK 安装后打不开或显示空白

**原因：** 网站 URL 配置错误

**解决：**
1. 确保 Host 配置正确（不含 https://）
2. 确保网站可以正常访问
3. 检查 manifest.json 中的 start_url

---

## 📋 快速检查清单

部署前：
- [ ] Web 应用已构建（`npm run build`）
- [ ] manifest.json 存在于 `public/` 目录
- [ ] 所有资源文件准备完成

部署后：
- [ ] 获得 Vercel URL
- [ ] 访问 URL 确认网站正常
- [ ] manifest.json 可访问

PWABuilder：
- [ ] 输入正确的 URL
- [ ] 配置 Package ID: `com.gastemple.app`
- [ ] 配置应用名称和版本
- [ ] 下载并解压 APK

提交前：
- [ ] APK 文件已下载
- [ ] 5 张截图已准备
- [ ] Publisher Avatar 已准备
- [ ] 所有 URL 可访问

---

## 🎉 预计时间

- 部署网站: 5 分钟
- PWABuilder 生成 APK: 5 分钟
- 下载和验证: 2 分钟
- **总计: 约 15 分钟**

---

**现在开始第一步：部署网站到 Vercel！**

运行命令：
```bash
vercel --prod
```
