const express = require('express');
const path = require('path');
const rssService = require('./services/rssService');
const contentSimplifier = require('./services/contentSimplifier');

const app = express();
const PORT = process.env.PORT || 3000;

// 设置视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静态文件
app.use(express.static('public'));

// 首页 - 显示文章列表
app.get('/', async (req, res) => {
  try {
    const articles = await rssService.getArticles();
    res.render('index', { articles });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    res.status(500).render('error', { message: '无法获取文章列表' });
  }
});

// 文章详情页
app.get('/article/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const articles = await rssService.getArticles();
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
      return res.status(404).render('error', { message: '文章未找到' });
    }

    // 获取并精简文章内容
    const simplifiedContent = await contentSimplifier.simplifyArticle(article.link);
    
    res.render('article', { 
      article: {
        ...article,
        content: simplifiedContent
      }
    });
  } catch (error) {
    console.error('获取文章详情失败:', error);
    res.status(500).render('error', { message: '无法获取文章详情' });
  }
});

// API端点 - 返回JSON格式的文章列表
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await rssService.getArticles();
    res.json({ success: true, data: articles });
  } catch (error) {
    console.error('API获取文章失败:', error);
    res.status(500).json({ success: false, error: '无法获取文章列表' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('正在从IT之家RSS获取文章...');
});
