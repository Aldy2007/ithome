const Parser = require('rss-parser');
const crypto = require('crypto');

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

// IT之家RSS源
const RSS_FEED_URL = 'https://www.ithome.com/rss/';

// 缓存
let cachedArticles = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

/**
 * 从RSS源获取文章列表
 */
async function getArticles() {
  // 检查缓存
  if (cachedArticles && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
    console.log('使用缓存的文章列表');
    return cachedArticles;
  }

  try {
    console.log('正在从RSS获取最新文章...');
    const feed = await parser.parseURL(RSS_FEED_URL);
    
    const articles = feed.items.map(item => {
      // 生成唯一ID
      const id = crypto.createHash('md5').update(item.link).digest('hex');
      
      return {
        id: id,
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.contentSnippet || item.content || '',
        author: item.creator || 'IT之家',
        categories: item.categories || []
      };
    });

    // 更新缓存
    cachedArticles = articles;
    cacheTime = Date.now();
    
    console.log(`成功获取 ${articles.length} 篇文章`);
    return articles;
  } catch (error) {
    console.error('获取RSS失败:', error.message);
    
    // 如果有旧缓存，返回旧缓存
    if (cachedArticles) {
      console.log('返回旧缓存数据');
      return cachedArticles;
    }
    
    throw new Error('无法获取RSS数据');
  }
}

/**
 * 清除缓存
 */
function clearCache() {
  cachedArticles = null;
  cacheTime = null;
  console.log('缓存已清除');
}

module.exports = {
  getArticles,
  clearCache
};
