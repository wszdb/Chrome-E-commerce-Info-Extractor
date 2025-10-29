# GitHub发布指南 | GitHub Publishing Guide

## 准备工作 | Preparation

### 1. 创建GitHub仓库 | Create GitHub Repository
1. 访问 [GitHub](https://github.com)
   Visit [GitHub](https://github.com)
2. 点击右上角的"+"号，选择"New repository"
   Click "+" in top right, select "New repository"
3. 填写仓库信息：
   Fill repository information:
   - **仓库名称**: `ecommerce-info-extractor` (推荐)
   - **Repository name**: `ecommerce-info-extractor` (recommended)
   - **描述**: 电商网站信息提取Chrome插件
   - **Description**: Chrome extension for e-commerce information extraction
   - **可见性**: Public (公开)
   - **Visibility**: Public
4. 点击"Create repository"
   Click "Create repository"

### 2. 准备插件文件 | Prepare Extension Files
确保以下文件在插件目录中：
Ensure these files are in the extension directory:
```
page-summarizer/
├── manifest.json          # 插件清单文件
├── popup.html             # 弹窗界面
├── popup.js               # 主要逻辑
├── popup.css              # 样式文件
├── content-script.js       # 内容脚本
├── icons/                 # 图标目录
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md              # 说明文档
└── GITHUB_PUBLISH_GUIDE.md # 发布指南
```

## 发布步骤 | Publishing Steps

### 步骤1: 初始化Git仓库 | Initialize Git Repository
```bash
# 进入插件目录
cd /path/to/page-summarizer

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "Initial commit: E-commerce Information Extractor Chrome Extension"
```

### 步骤2: 连接远程仓库 | Connect to Remote Repository
```bash
# 添加远程仓库 (替换为你的仓库地址)
git remote add origin https://github.com/your-username/ecommerce-info-extractor.git

# 推送到GitHub
git push -u origin main
```

### 步骤3: 创建Release | Create Release
1. 在GitHub仓库页面，点击"Releases"
   On GitHub repository page, click "Releases"
2. 点击"Create a new release"
   Click "Create a new release"
3. 填写Release信息：
   Fill release information:
   - **Tag version**: `v1.0.0`
   - **Release title**: `v1.0.0 - 电商网站信息提取助手`
   - **Description**: 
     ```
     ## 🎉 首次发布
     
     ### 主要功能
     - 🛒 支持6大电商平台 (淘宝、京东、苏宁、拼多多、唯品会、当当)
     - 🤖 AI智能信息提取
     - 📋 一键复制功能
     - 🎨 现代化用户界面
     - ⚙️ 灵活的API配置
     
     ### 技术特点
     - Chrome Extensions API
     - 现代化前端技术栈
     - 响应式设计
     - 无弹窗用户体验
     ```
4. 点击"Publish release"
   Click "Publish release"

## Chrome Web Store发布 | Chrome Web Store Publishing

### 准备工作 | Preparation
1. **开发者账户**: 注册 [Chrome Web Store开发者账户](https://chrome.google.com/webstore/developer/dashboard)
   **Developer Account**: Register [Chrome Web Store Developer Account](https://chrome.google.com/webstore/developer/dashboard)
2. **一次性费用**: 支付$5开发者注册费
   **One-time Fee**: Pay $5 developer registration fee

### 上传步骤 | Upload Steps
1. 访问 [Chrome开发者控制台](https://chrome.google.com/webstore/developer/dashboard)
   Visit [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
2. 点击"添加新项目"
   Click "Add new item"
3. 上传插件包：
   Upload extension package:
   - 将插件文件夹打包为ZIP文件
   - Package extension folder as ZIP file
   - 上传ZIP文件
   - Upload ZIP file
4. 填写商店信息：
   Fill store information:
   - **扩展名称**: 电商网站信息提取助手
   - **Extension Name**: E-commerce Information Extractor
   - **描述**: 智能提取电商网站商品信息
   - **Description**: Smart extraction of e-commerce product information
   - **分类**: 生产力工具 (Productivity)
   - **Category**: Productivity
   - **语言**: 中文、英文 (Chinese, English)
5. 上传图标和截图：
   Upload icons and screenshots:
   - 128x128图标 (128x128 icon)
   - 1280x800截图 (1280x800 screenshots)
   - 440x280截图 (440x280 screenshots)
6. 填写隐私政策链接 (可选)
   Fill privacy policy URL (optional)
7. 提交审核
   Submit for review

### 审核时间 | Review Time
- **通常**: 3-7个工作日
- **Usually**: 3-7 business days
- **状态通知**: 通过邮件通知
- **Status notification**: Email notification

## 推广策略 | Promotion Strategy

### 1. GitHub优化 | GitHub Optimization
- **README优化**: 详细的中文英文说明
- **标签管理**: 添加相关标签 (chrome-extension, e-commerce, ai)
- **Issues模板**: 创建问题反馈模板
- **Wiki文档**: 添加详细使用文档

### 2. 社区推广 | Community Promotion
- **技术社区**: 发布到V2EX、掘金、SegmentFault
- **社交媒体**: 微博、Twitter、LinkedIn分享
- **开发者论坛**: Chrome扩展开发者论坛
- **视频教程**: B站、YouTube使用教程

### 3. 用户反馈 | User Feedback
- **GitHub Issues**: 收集用户反馈
- **用户调研**: 了解使用场景
- **功能迭代**: 根据反馈优化功能
- **版本更新**: 定期发布新版本

## 维护指南 | Maintenance Guide

### 代码维护 | Code Maintenance
```bash
# 更新版本号
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 发布新版本
git tag v1.0.1
git push origin v1.0.1
```

### 用户支持 | User Support
- **及时回复**: 24小时内回复Issues
- **Bug修复**: 优先处理严重问题
- **功能建议**: 评估用户建议的可行性
- **文档更新**: 保持文档与功能同步

## 注意事项 | Important Notes

### 安全性 | Security
- **API密钥**: 提醒用户妥善保管
- **代码审查**: 定期检查安全漏洞
- **权限最小化**: 只申请必要的权限

### 合规性 | Compliance
- **商店政策**: 遵守Chrome Web Store政策
- **隐私保护**: 不收集用户隐私数据
- **开源协议**: 使用MIT许可证

---

## 快速开始 | Quick Start

### 立即发布 | Publish Now
1. **创建仓库**: [创建GitHub仓库](https://github.com/new)
   **Create Repository**: [Create GitHub Repository](https://github.com/new)
2. **上传代码**: 按照上述步骤上传
   **Upload Code**: Follow the steps above to upload
3. **发布Release**: 创建第一个Release
   **Create Release**: Create first release
4. **提交商店**: 提交到Chrome Web Store
   **Submit to Store**: Submit to Chrome Web Store

需要帮助？ | Need help?
- **GitHub Issues**: [提交问题](https://github.com/your-username/your-repo/issues)
- **Email**: your-email@example.com

祝发布成功！🎉 | Good luck with your release! 🎉
