# Gas Temple - Solana Mobile dApp Store 发布者配置指南

## 概述
本文档提供Gas Temple应用在Solana Mobile dApp Store发布时所需的发布者信息配置建议。

## 核心发布者信息

### 1. Publisher Name (发布者名称)
**选项分析**:

#### 选项1: Gas Temple Studio (推荐)
```yaml
name: "Gas Temple Studio"
```
**优势**:
- 保持品牌核心，与应用名称关联
- "Studio"表明是开发工作室，更专业
- 符合行业惯例，易于用户识别
- 为未来扩展其他应用留有余地

#### 选项2: Gas Temple (直接使用应用名称)
```yaml
name: "Gas Temple"
```
**优势**:
- 品牌完全一致，无需解释
- 简洁直接，用户容易理解
- 与应用截图和描述高度统一

**注意事项**:
- 应用和发布者同名可能造成轻微混淆
- 缺乏专业性后缀
- 未来开发其他应用时可能需要更改

#### 选项3: 其他备选方案
- `Gas Temple Labs`
- `Crypto Fortune Studio`
- `Blockchain Satire Collective`
- `功德工作室` (中文，与域名gongde.xyz呼应)

**最终建议**:
- **首次发布**: 使用`Gas Temple Studio`，平衡品牌和专业性
- **快速测试**: 使用`Gas Temple`，最简洁直接
- **长期品牌**: 考虑与域名一致的`功德工作室`，增强文化特色

### 2. Website (网站)
**推荐配置**:
```yaml
website: "https://gongde.xyz"
```

**域名优势**:
- `gongde.xyz` (功德) 与寺庙主题高度相关
- `.xyz` 域名适合创新和技术项目
- 简短易记，品牌识别度高
- 已拥有，无需额外注册费用

**网站内容要求**:
```markdown
必需内容:
- 应用介绍和功能展示
- 下载链接到Solana dApp Store
- 隐私政策页面 (已创建: /public/privacy-policy.html)
- 最终用户许可协议 (已创建: /public/eula.html)
- 联系方式和支持页面

推荐内容:
- 更新日志和版本信息
- 常见问题解答(FAQ)
- 用户评价和反馈
- 社交媒体链接
- 功德文化解释 (增强主题一致性)
```

**网站建设建议**:
1. **子目录结构**: `https://gongde.xyz/gastemple` (推荐)
2. **子域名结构**: `https://gastemple.gongde.xyz`
3. **根目录**: `https://gongde.xyz` (如果这是主要项目)

**技术实现**:
- 使用Vercel/Netlify免费部署
- 创建简单的React/Vue单页应用
- 确保移动端友好
- 添加Google Analytics跟踪

### 3. Publisher Avatar (发布者头像)
**技术规格**:
- **像素尺寸**: 512x512像素 (最小要求)，推荐1024x1024
- **分辨率**: 72 DPI (屏幕显示标准，300 DPI用于打印)
- **格式**: PNG (支持透明背景)
- **颜色模式**: RGB (屏幕显示)
- **文件大小**: 小于1MB
- **风格**: 清晰易识别，在不同尺寸下都可见

**DPI说明**:
- **72 DPI**: 屏幕显示标准，适合网站和应用商店
- **300 DPI**: 印刷品标准，文件较大，不适合网络传输
- **Solana要求**: 只关注像素尺寸(512x512)，DPI设置不影响审核

**头像选择分析**:

#### 选项A: 使用现有"敲木鱼的蛙"头像 (推荐)
```
优势:
1. 品牌一致性: 与您现有的个人/品牌形象一致
2. 主题相关: "敲木鱼的蛙"直接关联功德和寺庙主题
3. 识别度高: 现有粉丝/用户容易识别
4. 情感连接: 卡通形象更亲切，符合应用幽默风格

要求:
- 确保图像清晰，512x512像素
- 背景简洁，最好透明或纯色
- 风格与应用整体美学协调
```

#### 选项B: 寺庙图标简约版
```
设计: 金色寺庙图标(⛩️)在黑色圆形背景上
颜色: 金色(#c9a962) + 黑色(#0a0a0a)
优势: 与应用名称"Gas Temple"直接相关，专业简洁
```

#### 选项C: 结合设计 (蛙+寺庙)
```
设计: "敲木鱼的蛙"在寺庙背景前
寓意: 结合个人品牌和应用主题
优势: 两全其美，既有个人特色又有应用关联
```

**推荐策略**:
1. **短期/首次发布**: 使用现有"敲木鱼的蛙"头像，保持品牌连续性
2. **长期/品牌升级**: 设计专门的应用品牌头像，结合蛙和寺庙元素
3. **A/B测试**: 可以准备两个版本，测试用户反应

**头像优化建议**:
1. 如果现有头像不是512x512，需要重新调整尺寸
2. 确保头像在不同背景色下都清晰可见
3. 测试在小尺寸(如64x64)下的可识别性
4. 保持风格与应用截图一致

### 4. 发布者描述 (可选但推荐)
**英文描述**:
```
Gas Temple Studio is a blockchain satire collective creating humorous yet insightful crypto experiences. We blend traditional fortune-telling aesthetics with modern cryptocurrency commentary to create unique dApps that educate and entertain.
```

**中文描述**:
```
Gas Temple Studio是一个区块链讽刺创意团队，致力于创作既幽默又富有洞察力的加密货币体验。我们将传统的算命美学与现代加密货币评论相结合，创造出既能教育又能娱乐的独特dApp。
```

## Solana dApp Store 提交清单

### 基本信息
- [ ] 应用名称: Gas Temple
- [ ] 应用描述: 已优化，符合政策要求
- [ ] 分类: Entertainment / Utilities
- [ ] 年龄分级: 12+ (因包含加密货币内容)

### 发布者信息
- [ ] Publisher Name: Gas Temple Studio (推荐) 或 Gas Temple
- [ ] Website: https://gongde.xyz (推荐使用子目录: https://gongde.xyz/gastemple)
- [ ] Publisher Avatar: 512x512 PNG图像
- [ ] 联系邮箱: your-email@example.com (建议使用域名邮箱: contact@gongde.xyz)

### 合规性检查
- [ ] 无赌博相关词汇 (已完成修改)
- [ ] 高风险提示清晰 (已添加)
- [ ] 隐私政策完整 (已创建)
- [ ] EULA协议完整 (已创建)
- [ ] 截图符合要求 (1080x1920, 5张)
- [ ] 身份验证: Complete identity verification now (建议勾选，2025年2月15日前必须完成)

### 技术配置
- [ ] PWA配置完成 (manifest.json)
- [ ] Service Worker配置 (sw.js)
- [ ] Solana Wallet Adapter集成
- [ ] Android APK构建配置 (bubblewrap)

## 实施步骤

### 阶段1: 准备发布者资料 (1-2天)
1. 配置现有域名 (gongde.xyz) 指向网站
2. 创建简单网站 (单页应用即可，建议使用子目录: /gastemple)
3. 设计发布者头像 (512x512 PNG)
4. 准备联系邮箱 (建议使用域名邮箱: contact@gongde.xyz)

### 阶段2: 提交到Solana dApp Store (1天)
1. 访问 Solana Mobile dApp Store Publishing Portal
2. 填写所有必填字段:
   - 应用基本信息 (名称、描述、分类)
   - 发布者信息 (Name, Website, Publisher Avatar)
   - 合规信息 (年龄分级、内容警告)
3. 上传Publisher Avatar:
   - 点击"Publisher Avatar (Optional)"字段的上传按钮
   - 选择准备好的512x512 PNG图像
   - 确认预览显示正常
4. 上传应用截图 (5张1080x1920)
5. 上传APK文件 (通过Bubblewrap生成)
6. 提交审核

### 阶段3: 审核跟进 (3-7天)
1. 监控审核状态
2. 准备回应可能的审核问题
3. 根据反馈进行必要修改
4. 发布成功后推广应用

## Publisher Avatar 上传指南

### 上传位置
**是的，只需要在Solana dApp Store Publishing Portal上传即可**

### 具体步骤：
1. **登录Portal**: 访问 Solana Mobile dApp Store Publishing Portal
2. **找到字段**: 在"Publisher Information"部分找到"Publisher Avatar (Optional)"
3. **点击上传**: 点击上传按钮或拖放区域
4. **选择文件**: 选择准备好的512x512 PNG图像文件
5. **确认预览**: 系统会显示预览，确认图像显示正常
6. **保存更改**: 完成其他字段填写后保存提交

### 上传注意事项：
1. **文件格式**: 只接受常见图像格式 (PNG, JPG, JPEG)
2. **尺寸验证**: 系统可能自动验证最小512x512像素要求
3. **文件大小**: 建议小于1MB，确保上传速度
4. **预览检查**: 务必检查预览效果，确保无裁剪或变形
5. **可选但推荐**: 虽然标记为Optional，但强烈建议上传以增强专业性

### 技术验证清单：
- [ ] 图像尺寸: 512x512像素
- [ ] 文件格式: PNG (推荐，支持透明背景)
- [ ] 文件大小: < 1MB
- [ ] 分辨率: 72 DPI (屏幕显示标准)
- [ ] 预览测试: 在不同背景色下清晰可见
- [ ] 品牌一致性: 与"敲木鱼的蛙"形象一致

## 常见问题

### Q: 项目还没有邮箱系统怎么办？
A: 有以下解决方案：
1. **临时方案**: 使用免费邮箱如 `gastemple.studio@gmail.com`
2. **推荐方案**: 使用您的域名 `gongde.xyz` 设置邮箱，如 `contact@gongde.xyz`
3. **技术方案**: 使用Cloudflare Email Routing免费转发服务

### Q: "Complete identity verification now"要勾选吗？
A: **建议勾选**。这是Solana dApp Store的要求，必须在2025年2月15日前完成身份验证。提前完成可以避免截止日期前的匆忙，并确保应用不会被暂停。

### Q: 身份验证需要什么文件？
A: 通常需要：
1. 政府颁发的带照片身份证件（护照、驾照等）
2. 地址证明（水电费账单、银行对账单等）
3. 可能的面部识别验证
4. 税务信息（取决于所在地区）

### Q: 身份验证流程需要多长时间？
A: 通常需要1-3个工作日，但建议尽早开始以避免延误。

### Q: Publisher Avatar在哪里上传？
A: 只在Solana dApp Store Publishing Portal的发布者信息部分上传，无需在其他地方重复上传。

### Q: 如果没有网站怎么办？
A: 可以使用GitHub仓库链接作为临时解决方案，但建议尽快创建简单网站。

### Q: 发布者头像必须是什么风格？
A: 建议使用简约专业的设计，避免过于复杂或卡通化的风格。

### Q: 发布者名称可以更改吗？
A: 可以，但建议保持一致性，避免频繁更改。

### Q: 需要提供真实身份信息吗？
A: Solana可能需要验证发布者身份，建议使用真实或可验证的信息。

## 邮箱系统建立指南

### 需求分析
Solana dApp Store需要发布者联系邮箱，建议使用专业域名邮箱增强可信度。

### 方案选择：

#### 方案1: 免费邮箱服务 (快速启动)
- **Gmail**: `gastemple.studio@gmail.com`
- **Outlook**: `gastemple@outlook.com`
- **优点**: 免费、立即可用
- **缺点**: 不够专业，与域名不匹配

#### 方案2: 域名邮箱服务 (推荐)
使用您的域名 `gongde.xyz` 创建专业邮箱：

**免费选项**:
1. **Zoho Mail**: 免费版提供5GB存储，支持5个用户
2. **Yandex Mail**: 免费域名邮箱服务
3. **Mail.ru**: 提供免费域名邮箱

**付费选项** (推荐):
1. **Google Workspace**: $6/月，包含Gmail和办公套件
2. **Microsoft 365**: $5/月，包含Outlook和Office
3. **Zoho Mail Lite**: $1/月，性价比较高

#### 方案3: 邮件转发服务 (最简单)
- **Cloudflare Email Routing**: 免费，将邮件转发到现有邮箱
- **Forward Email**: 免费开源方案
- **优点**: 无需管理邮箱服务器，邮件自动转发

### 实施步骤 (以Cloudflare为例):

1. **域名DNS配置**:
   ```
   在Cloudflare DNS设置中添加:
   MX记录: gongde.xyz → mail.gongde.xyz
   TXT记录: SPF和DKIM记录
   ```

2. **Cloudflare Email Routing设置**:
   - 启用Email Routing
   - 创建地址: contact@gongde.xyz
   - 设置转发到您的个人邮箱

3. **测试邮箱**:
   - 发送测试邮件到 contact@gongde.xyz
   - 确认转发到您的个人邮箱

### 紧急解决方案:
如果时间紧迫，可以先使用:
- **临时Gmail**: gastemple.studio@gmail.com
- **后续更新**: 在邮箱系统建立后更新Portal信息

## 资源文件位置
- 隐私政策: `/public/privacy-policy.html`
- EULA协议: `/public/eula.html`
- PWA配置: `/public/manifest.json`
- 应用截图: `/screenshots/` 目录
- 合规性报告: `COMPLIANCE_CHECK.md`

## 联系方式
如需进一步协助，请参考项目文档或联系项目维护者。

---
*最后更新: 2026-01-21*
*文档版本: 1.6*
*更新内容:
1. 适配现有域名 gongde.xyz
2. 添加"敲木鱼的蛙"头像选择分析
3. 提供头像选择策略建议
4. 添加DPI技术说明 (72 DPI vs 300 DPI)
5. 添加Publisher Avatar上传指南和具体步骤
6. 添加Publisher Name选项分析 (Gas Temple vs Gas Temple Studio)
7. 添加身份验证指南 (Complete identity verification now)*