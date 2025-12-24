# IT之家精简版

一个基于Express的IT之家反向代理网站，通过RSS获取文章并提供精简的阅读体验。

## 功能特点

- ✨ 通过RSS获取IT之家最新文章
- 🎨 简洁清爽的界面设计
- 📱 响应式布局，支持移动端
- 🚀 只保留文章核心内容（文字、图片、链接）
- ⚡ 自动缓存机制，提升访问速度
- 🔗 支持图片懒加载

## 技术栈

- **Node.js** - 运行环境
- **Express** - Web框架
- **RSS Parser** - RSS解析
- **Cheerio** - HTML解析和处理
- **Axios** - HTTP请求
- **EJS** - 模板引擎

## 安装

```bash
# 安装依赖
npm install

# 启动服务器
npm start

# 开发模式（自动重启）
npm run dev
```

## 使用

服务器启动后，访问 `http://localhost:3000` 即可查看文章列表。

### 可用路由

- `/` - 首页，显示文章列表
- `/article/:id` - 文章详情页
- `/api/articles` - API接口，返回JSON格式的文章列表

## 环境变量

可以通过环境变量自定义端口：

```bash
PORT=8080 npm start
```

## 项目结构

```
ithome/
├── app.js                      # 主应用文件
├── package.json               # 项目配置
├── services/
│   ├── rssService.js         # RSS获取和解析服务
│   └── contentSimplifier.js  # 内容精简处理服务
└── views/
    ├── index.ejs             # 首页模板
    ├── article.ejs           # 文章详情模板
    └── error.ejs             # 错误页面模板
```

## 注意事项

- 本项目仅供学习交流使用
- 所有内容版权归IT之家所有
- 请遵守相关法律法规和网站使用条款

## License

MIT
