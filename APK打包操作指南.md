# Gas Temple APK 打包操作指南

## 🎯 当前状态

✅ **已完成:**
- Web 应用已构建 (`dist/` 目录)
- TWA 配置已更新为生产环境 (`twa-manifest.json`)
- 所有提交材料已准备完成

⏳ **进行中:**
- APK 构建过程已启动，等待交互式输入

## 📱 完成 APK 构建

### 当前正在等待你的输入

Bubblewrap 正在询问：
```
No checksum file was found to verify the state of the twa-manifest.json file.
To make sure your project is up-to-date, would you like to regenerate your project?
If you are sure your project is updated and you have already run bubblewrap update
then you may enter "no" (Y/n)
```

**请输入:** `n` (然后按 Enter)

### 后续会询问的问题

1. **versionName for the new App version:**
   - 输入: `1.0.0`

2. **versionCode for the new App version:**
   - 输入: `1`

3. 其他问题直接按 Enter 使用默认值

### 完整命令流程

如果当前构建中断，可以重新运行：

```bash
# 方法 1: 使用批处理脚本
快速打包APK.bat

# 方法 2: 手动命令
npx @bubblewrap/cli build --skipPwaValidation
```

## 📦 APK 生成后的位置

构建成功后，APK 将在以下位置之一：
- `app-release-signed.apk` (签名版本)
- `app-release-unsigned.apk` (未签名版本)
- `android-build/app/build/outputs/apk/release/app-release-signed.apk`

脚本会自动复制到: `gas-temple-release.apk`

## 🚀 提交到 Solana dApp Store

### 步骤 1: 准备 Publisher Avatar

创建一个 512x512 PNG 图像作为发布者头像：
- 建议使用"敲木鱼的蛙"头像
- 保存为 `publisher-avatar.png`

### 步骤 2: 部署网站

将 `dist/` 目录部署到 `https://gongde.xyz`:

**使用 Vercel (推荐):**
```bash
npm i -g vercel
vercel --prod
```

**使用 Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

确保以下 URL 可访问：
- https://gongde.xyz/manifest.json
- https://gongde.xyz/privacy-policy.html
- https://gongde.xyz/eula.html
- https://gongde.xyz/temple.svg

### 步骤 3: 访问提交门户

1. 访问: https://dapp-publishing.solanamobile.com/
2. 使用 Solana 钱包登录
3. 点击 "Submit New App"

### 步骤 4: 填写应用信息

**基本信息:**
- App Name: `Gas Temple - 功德无量`
- Short Name: `Gas Temple`
- Package ID: `com.gastemple.app`
- Version: `1.0.0`
- Category: `Entertainment`
- Age Rating: `12+`

**描述:**
```
Gas Temple is a crypto research entertainment platform that transforms boring cryptocurrency research into a gacha-style gaming experience.

Features:
• Random Crypto Project Cards - Draw random crypto projects with satirical reviews
• Ponzi Index - Visual risk level indicators
• Leaderboard - On-chain hall of fame
• SBT Badges - Soul-bound achievement system
• Digital Wooden Fish - Tap to accumulate merit and relieve investment anxiety

⚠️ High Risk Warning: This app involves cryptocurrency content. All information is for entertainment purposes only and does not constitute investment advice. Cryptocurrency investments carry high risks.

功德无量 - 既然都要亏，不如亏得好笑一点
```

**发布者信息:**
- Publisher Name: `Gas Temple Studio`
- Website: `https://gongde.xyz`
- Contact Email: 你的邮箱地址
- Publisher Avatar: 上传 `publisher-avatar.png`

**上传文件:**
- APK: `gas-temple-release.apk`
- Screenshots: `screenshots/` 目录中的 5 张图片
- Privacy Policy URL: `https://gongde.xyz/privacy-policy.html`
- EULA URL: `https://gongde.xyz/eula.html`

**合规信息:**
- ✅ 勾选 "Complete identity verification now"
- ✅ 勾选 "Financial/Cryptocurrency Content" 警告

### 步骤 5: 提交审核

1. 检查所有信息
2. 点击 "Submit for Review"
3. 等待审核结果 (3-7 天)

## 📋 提交材料清单

### ✅ 已准备完成
- [x] Web 应用构建
- [x] TWA 配置文件
- [x] 5 张应用截图 (1080x1920)
- [x] 隐私政策文件
- [x] EULA 文件
- [x] 应用图标

### ⏳ 待完成
- [ ] APK 文件 (正在构建中)
- [ ] Publisher Avatar (512x512 PNG)
- [ ] 网站部署到 gongde.xyz
- [ ] 联系邮箱设置

## 🔧 故障排除

### APK 构建失败

**问题: Java 未安装**
- 下载安装: https://adoptium.net/
- 安装 Java JDK 11 或更高版本

**问题: Android SDK 未安装**
- Bubblewrap 会自动下载
- 首次构建需要较长时间
- 确保网络连接正常

**问题: 权限错误**
- 以管理员身份运行命令提示符
- 重新运行构建命令

### 网站部署问题

**问题: 没有 Vercel/Netlify 账号**
- 使用 GitHub 账号快速注册
- 完全免费

**问题: 域名未配置**
- 在域名注册商处添加 DNS 记录
- 指向 Vercel/Netlify 提供的地址

## 📚 相关文档

- `SOLANA_SUBMISSION_GUIDE.md` - 完整提交指南
- `提交材料清单.md` - 材料清单
- `PUBLISHER_CONFIG.md` - 发布者配置
- `COMPLIANCE_CHECK.md` - 合规检查

---

**下一步行动:**
1. 在当前命令行窗口输入 `n` 继续 APK 构建
2. 按提示输入版本信息
3. 等待 APK 构建完成
4. 准备 Publisher Avatar
5. 部署网站
6. 提交到 Solana dApp Store

**祝你提交顺利！⛩️**
