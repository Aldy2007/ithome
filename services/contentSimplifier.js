const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 获取并精简文章内容
 * 只保留文字、图片和链接
 */
async function simplifyArticle(url) {
  try {
    console.log(`正在获取文章: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    // IT之家文章内容通常在 .post_content 或 .content 类中
    let content = $('.post_content, .content, article');
    
    if (content.length === 0) {
      // 备选方案：查找主要内容区域
      content = $('main, #main, .main-content');
    }

    if (content.length === 0) {
      throw new Error('无法找到文章内容');
    }

    // 移除不需要的元素
    content.find('script, style, iframe, .ad, .advertisement, .related, .comment, .social-share, nav, footer, header').remove();
    
    // 处理图片
    content.find('img').each((i, elem) => {
      const $img = $(elem);
      const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original');
      
      if (src) {
        // 确保图片URL是绝对路径
        if (src.startsWith('//')) {
          $img.attr('src', 'https:' + src);
        } else if (src.startsWith('/')) {
          $img.attr('src', 'https://www.ithome.com' + src);
        } else {
          $img.attr('src', src);
        }
        
        // 移除不必要的属性，只保留src和alt
        const alt = $img.attr('alt') || '';
        $img.removeAttr('class').removeAttr('style').removeAttr('data-src').removeAttr('data-original');
        $img.attr('alt', alt);
        $img.attr('loading', 'lazy'); // 添加懒加载
      } else {
        $img.remove(); // 移除无效图片
      }
    });

    // 处理链接
    content.find('a').each((i, elem) => {
      const $link = $(elem);
      let href = $link.attr('href');
      
      if (href) {
        // 确保链接是绝对路径
        if (href.startsWith('/') && !href.startsWith('//')) {
          $link.attr('href', 'https://www.ithome.com' + href);
        }
        
        // 添加新窗口打开属性
        $link.attr('target', '_blank');
        $link.attr('rel', 'noopener noreferrer');
      }
    });

    // 清理空白标签和格式
    content.find('*').each((i, elem) => {
      const $elem = $(elem);
      
      // 移除大部分样式和类
      $elem.removeAttr('class').removeAttr('style').removeAttr('id');
      
      // 保留语义化标签
      const allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'br'];
      
      if (!allowedTags.includes(elem.name)) {
        // 不在允许列表中的标签，替换为其内容
        if (elem.name !== 'div' && elem.name !== 'span') {
          $elem.replaceWith($elem.html());
        }
      }
      
      // 移除空标签
      if ($elem.text().trim() === '' && !$elem.find('img').length) {
        $elem.remove();
      }
    });

    return content.html();
  } catch (error) {
    console.error('精简文章内容失败:', error.message);
    return `<p>抱歉，无法加载文章内容。</p><p>原文链接: <a href="${url}" target="_blank">${url}</a></p>`;
  }
}

module.exports = {
  simplifyArticle
};
