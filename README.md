# PostCSS Worker Demo

这是一个演示如何在 Web Worker 中运行 PostCSS transform 操作的 demo。

## 功能特性

- 🚀 使用 Web Worker 在后台处理 CSS
- 🎨 支持 PostCSS 插件（Autoprefixer, CSSNano）
- 💻 现代化的 Web 界面
- ⚡ 实时 CSS 转换

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动服务器：
```bash
npm start
```

3. 打开浏览器访问：`http://localhost:3000`

## 项目结构

- `main.js` - 主线程文件，处理 UI 和与 Worker 通信
- `worker.js` - Web Worker 文件，运行 PostCSS 转换
- `index.html` - 用户界面
- `server.js` - 简单的 Express 服务器

## 使用方法

1. 在左侧文本框中输入 CSS 代码
2. 点击"转换 CSS"按钮
3. 在右侧查看转换后的结果

## 技术栈

- PostCSS
- Autoprefixer
- CSSNano
- Web Workers
- Express.js 