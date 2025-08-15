# PostCSS Worker Demo

一个演示如何在 Web Worker 中运行 PostCSS 转换的项目。

## 🏗️ 架构设计

### 主线程 (Main Thread)
- **配置管理**: 读取 PostCSS 配置文件 (`postcss.config.js`)
- **插件加载**: 加载和配置 PostCSS 插件 (TailwindCSS, Autoprefixer, CSSNano 等)
- **Worker 通信**: 与 Web Worker 进行消息传递
- **用户界面**: 提供测试界面和结果显示

### Web Worker 线程
- **PostCSS 执行**: 接收配置好的处理器，执行 CSS 转换
- **转换处理**: 处理 TailwindCSS 指令、CSS 变量、嵌套 CSS 等
- **结果返回**: 将转换结果发送回主线程

## 🚀 特性

- ✅ **完全在 Worker 中运行**: 所有 PostCSS 转换都在 Web Worker 中执行
- ✅ **主线程配置**: 配置读取和插件加载在主线程中完成
- ✅ **实时转换**: 支持实时 CSS 转换和预览
- ✅ **多种测试用例**: 包含 TailwindCSS、CSS 变量、嵌套 CSS 等示例
- ✅ **状态监控**: 实时显示 Worker 状态和转换进度
- ✅ **错误处理**: 完善的错误处理和状态反馈

## 📦 技术栈

- **PostCSS**: CSS 转换工具
- **TailwindCSS**: 实用优先的 CSS 框架
- **Web Workers**: 后台线程处理
- **Rsbuild**: 构建工具
- **Express**: 开发服务器

## 🛠️ 安装和运行

### 安装依赖
```bash
pnpm install
```

### 构建 Worker
```bash
npm run build:worker
```

### 启动开发服务器
```bash
npm start
```

然后在浏览器中访问 `http://localhost:3000`

## 🔧 使用方法

### 1. 初始化
点击"初始化 PostCSS"按钮，系统会：
- 读取 PostCSS 配置
- 加载必要的插件
- 将配置传递给 Worker
- 显示配置信息

### 2. CSS 转换
- 在输入框中输入 CSS 代码
- 点击"转换 CSS"按钮
- 查看转换结果

### 3. 测试用例
- 切换到"测试用例"标签页
- 点击"运行所有测试"
- 查看各种 PostCSS 功能的测试结果

### 4. 示例代码
- 切换到"示例代码"标签页
- 选择不同类型的 CSS 示例
- 加载到转换器中进行测试

## 📁 项目结构

```
postcss-worker-demo/
├── index.html              # 主界面
├── worker.js               # Worker 实现
├── postcss.config.js       # PostCSS 配置
├── tailwind.config.js      # TailwindCSS 配置
├── rsbuild.config.js       # 构建配置
├── package.json            # 项目依赖
├── dist/                   # 构建输出
│   └── static/js/
│       └── postcss-transform-web-worker.js
└── README.md               # 项目说明
```

## 🔄 工作流程

1. **初始化阶段**
   ```
   主线程 → 读取配置 → 加载插件 → 创建处理器 → 发送给 Worker
   ```

2. **转换阶段**
   ```
   用户输入 → 主线程 → Worker → PostCSS 处理 → 结果返回 → 显示
   ```

3. **测试阶段**
   ```
   测试请求 → Worker → 执行测试用例 → 返回结果 → 显示测试报告
   ```

## 🎯 支持的 CSS 特性

- **TailwindCSS**: `@apply` 指令、组件层、工具类
- **CSS 变量**: `:root` 变量定义和使用
- **嵌套 CSS**: 选择器嵌套和 `&` 引用
- **媒体查询**: 响应式设计支持
- **PostCSS 插件**: Autoprefixer、CSSNano 等

## 🐛 故障排除

### Worker 未加载
- 检查 `dist/static/js/` 目录是否存在
- 重新运行 `npm run build:worker`

### PostCSS 初始化失败
- 检查 `postcss.config.js` 配置
- 确认所有依赖已正确安装

### 转换失败
- 检查浏览器控制台错误信息
- 确认 CSS 语法正确
- 查看 Worker 状态

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License 