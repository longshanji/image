# ImageVerse - AI 图像诗歌生成器

一个基于 Next.js 和 Google AI 的智能图像分析和诗歌生成应用。

## 功能特点

- 🖼️ 图像上传与分析
- 🤖 AI 驱动的场景识别
- 📝 自动生成中英文诗歌
- 🎨 自定义诗歌卡片样式
- 💾 导出分享功能

## 技术栈

- Next.js 14
- TypeScript
- Google Generative AI
- Genkit
- Radix UI
- Tailwind CSS

## 开始使用

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/imageverse.git
cd imageverse
```

2. 安装依赖
```bash
npm install
```

3. 环境配置
创建 `.env.local` 文件：
```env
GOOGLE_GENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_API_PROXY=http://127.0.0.1:2321  # 如果需要代理
```

4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:9002 查看应用

## 部署

### 本地部署
```bash
npm run build
npm run start
```

### Google Cloud 部署
```bash
gcloud app deploy
```

## 项目结构

```
imageverse/
├── src/
│   ├── ai/         # AI 相关代码
│   ├── app/        # Next.js 页面
│   ├── components/ # UI 组件
│   └── utils/      # 工具函数
├── public/         # 静态资源
└── ...配置文件
```

## 主要功能说明

1. **图像上传**
   - 支持拖拽上传
   - 自动压缩优化

2. **AI 分析**
   - 场景识别
   - 物体检测
   - 情感分析

3. **诗歌生成**
   - 支持中英文
   - 自定义风格
   - 实时预览

4. **卡片定制**
   - 字体选择
   - 大小调整
   - 颜色配置

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

- 项目作者：[Your Name]
- 邮箱：[your.email@example.com]
- 项目地址：[GitHub Repository URL]

## 致谢

- Google AI 团队
- Next.js 团队
- 所有贡献者
