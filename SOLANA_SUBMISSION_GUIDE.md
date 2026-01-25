# Gas Temple - Solana dApp Store 提交完整指南

## 📦 APK 打包步骤

### 方法 1: 使用 Bubblewrap CLI (推荐)

由于 Bubblewrap 需要交互式输入，请按以下步骤操作：

```bash
# 1. 确保已构建 Web 应用
npm run build

# 2. 运行 Bubblewrap build 命令
npx @bubblewrap/cli build --skipPwaValidation
```

**交互式问题回答：**
- `versionName for the new App version:` → 输入 `1.0.0`
- `versionCode for the new App version:` → 输入 `1`
- 其他提示直接按 Enter 使用默认值

### 方法 2: 使用自动化脚本

```bash
# 运行自动化构建脚本
node build-apk-auto.cjs
```

### 构建成功后

APK 文件将生成在以下位置之一：
- `app-release-signed.apk`
- `app-release-unsigned.apk`
- `android-build/app/build/outputs/apk/release/app-release-signed.apk`

脚本会自动复制到 `gas-temple-release.apk`

## 📋 Solana dApp Store 提交清单

### 1. 应用基本信息

**必填字段：**
- **App Name**: `Gas Temple - 功德无量`
- **Short Name**: `Gas Temple`
- **Package ID**: `com.gastemple.app`
- **Version Name**: `1.0.0`
- **Version Code**: `1`
- **Category**: `Entertainment` 或 `Finance`
- **Age Rating**: `12+` (包含加密货币内容)

**描述 (Description):**
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

### 2. 发布者信息 (Publisher Information)

**必填字段：**
- **Publisher Name**: `Gas Temple Studio` (推荐) 或 `Gas Temple`
- **Website**: `https://gongde.xyz`
- **Contact Email**: `contact@gongde.xyz` 或临时使用 Gmail
- **Publisher Avatar**: 512x512 PNG 图像

**Publisher Avatar 要求：**
- 尺寸: 512x512 像素（最小要求）
- 格式: PNG（支持透明背景）
- 文件大小: < 1MB
- 分辨率: 72 DPI
- 建议使用"敲木鱼的蛙"头像或寺庙图标

### 3. 应用资源文件

**APK 文件：**
- ✅ `gas-temple-release.apk` (构建后生成)

**截图 (Screenshots):**
需要 5 张截图，规格：1080x1920 像素

检查 `screenshots/` 目录中的文件：
1. `gacha1.png` - 抽签随机项目辣评
2. `gacha2.png` - 赛博木鱼功德
3. `gacha3.png` - 辣评项目详情
4. `gacha4.png` - 项目坟场
5. `gacha5.png` - 开发者项目介绍

**应用图标：**
- `public/temple.svg` - 主图标
- `public/muyu-static.gif` - 备用图标

### 4. 法律文件

**隐私政策 (Privacy Policy):**
- URL: `https://gongde.xyz/privacy-policy.html`
- 本地文件: `public/privacy-policy.html`

**最终用户许可协议 (EULA):**
- URL: `https://gongde.xyz/eula.html`
- 本地文件: `public/eula.html`

### 5. 技术配置

**Web Manifest:**
- ✅ `public/manifest.json` - PWA 配置文件
- ✅ 已包含所有必需字段

**TWA Manifest:**
- ✅ `twa-manifest.json` - 已更新为生产环境 URL
- ✅ 使用 `https://gongde.xyz` 作为基础 URL

## 🚀 提交流程

### 步骤 1: 准备文件

1. **构建 APK**
   ```bash
   npx @bubblewrap/cli build --skipPwaValidation
   ```

2. **准备 Publisher Avatar**
   - 创建或调整现有头像为 512x512 PNG
   - 保存为 `publisher-avatar.png`

3. **验证截图**
   - 确认 `screenshots/` 目录中有 5 张 1080x1920 图片
   - 如需重新生成，参考 `SCREENSHOTS_GUIDE.md`

4. **部署网站** (如果还未部署)
   - 将 `dist/` 目录部署到 `https://gongde.xyz`
   - 确保 `manifest.json`, `privacy-policy.html`, `eula.html` 可访问

### 步骤 2: 访问 Solana dApp Store Portal

1. 访问: [Solana Mobile dApp Store Publishing Portal](https://dapp-publishing.solanamobile.com/)
2. 使用 Solana 钱包登录
3. 点击 "Submit New App" 或 "Create New Listing"

### 步骤 3: 填写应用信息

**基本信息页面：**
- App Name: `Gas Temple - 功德无量`
- Short Name: `Gas Temple`
- Package ID: `com.gastemple.app`
- Category: 选择 `Entertainment` 或 `Finance`
- Description: 粘贴上面准备的描述

**发布者信息页面：**
- Publisher Name: `Gas Temple Studio`
- Website: `https://gongde.xyz`
- Contact Email: 你的邮箱地址
- Publisher Avatar: 上传 `publisher-avatar.png`

**应用资源页面：**
- APK File: 上传 `gas-temple-release.apk`
- App Icon: 上传 `public/temple.svg` 或转换为 PNG
- Screenshots: 上传 5 张截图（按顺序）

**合规信息页面：**
- Age Rating: `12+`
- Content Warnings: 勾选 "Financial/Cryptocurrency Content"
- Privacy Policy URL: `https://gongde.xyz/privacy-policy.html`
- EULA URL: `https://gongde.xyz/eula.html`

**身份验证：**
- ✅ 勾选 "Complete identity verification now"
- 按提示完成 KYC 验证（2025年2月15日前必须完成）

### 步骤 4: 审核和发布

1. **提交审核**
   - 仔细检查所有信息
   - 点击 "Submit for Review"

2. **等待审核** (通常 3-7 天)
   - 监控邮箱获取审核状态更新
   - 准备回应可能的审核问题

3. **审核通过后**
   - 应用将在 Solana dApp Store 上线
   - 开始推广和营销

## ⚠️ 常见问题

### Q: 没有 Android SDK 怎么办？
A: Bubblewrap 会自动下载和安装 Android SDK。首次运行可能需要较长时间。

### Q: 没有 Java 怎么办？
A: 需要安装 Java JDK 11 或更高版本。下载地址: https://adoptium.net/

### Q: APK 构建失败怎么办？
A: 常见原因：
1. 网络问题 - 检查网络连接
2. 权限问题 - 以管理员身份运行
3. 磁盘空间不足 - 清理磁盘空间
4. 首次构建 - Bubblewrap 需要下载依赖，耐心等待

### Q: 网站还没部署怎么办？
A: 
1. **临时方案**: 可以先使用 localhost 测试 APK
2. **推荐方案**: 使用 Vercel/Netlify 快速部署
   ```bash
   # 使用 Vercel
   npm i -g vercel
   vercel --prod
   
   # 或使用 Netlify
   npm i -g netlify-cli
   netlify deploy --prod
   ```

### Q: 没有域名邮箱怎么办？
A: 
1. **临时方案**: 使用 Gmail (如 `gastemple.studio@gmail.com`)
2. **推荐方案**: 使用 Cloudflare Email Routing 免费转发
3. **付费方案**: Google Workspace ($6/月)

### Q: Publisher Avatar 用什么图？
A: 建议使用"敲木鱼的蛙"头像，与品牌一致。确保：
- 512x512 像素
- PNG 格式
- 背景简洁或透明
- 在小尺寸下清晰可见

## 📊 提交前检查清单

- [ ] ✅ Web 应用已构建 (`npm run build`)
- [ ] ✅ APK 已生成 (`gas-temple-release.apk`)
- [ ] ✅ APK 已在 Android 设备上测试
- [ ] ✅ 5 张截图已准备 (1080x1920)
- [ ] ✅ Publisher Avatar 已准备 (512x512 PNG)
- [ ] ✅ 网站已部署到 `https://gongde.xyz`
- [ ] ✅ 隐私政策可访问
- [ ] ✅ EULA 可访问
- [ ] ✅ 联系邮箱已设置
- [ ] ✅ 应用描述已优化（无赌博词汇）
- [ ] ✅ 高风险警告已添加
- [ ] ✅ 准备完成身份验证

## 🎯 下一步行动

1. **立即执行**: 运行 APK 构建命令
   ```bash
   npx @bubblewrap/cli build --skipPwaValidation
   ```

2. **准备资源**: 
   - 创建 Publisher Avatar (512x512 PNG)
   - 验证截图文件

3. **部署网站**: 
   - 将 `dist/` 部署到 `https://gongde.xyz`
   - 测试所有 URL 可访问

4. **提交应用**:
   - 访问 Solana dApp Store Portal
   - 填写所有信息
   - 上传文件
   - 提交审核

## 📚 参考文档

- `PUBLISHER_CONFIG.md` - 发布者配置详细指南
- `COMPLIANCE_CHECK.md` - 合规性检查报告
- `SCREENSHOTS_GUIDE.md` - 截图制作指南
- `README.md` - 项目说明

---

**祝你提交顺利！功德无量！** ⛩️

*最后更新: 2026-01-22*
