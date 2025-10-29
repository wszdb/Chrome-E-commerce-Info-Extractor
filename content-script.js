// Content Script for Page Summarizer

// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getPageContent') {
        try {
            // 获取页面主要内容
            const pageContent = getPageMainContent();
            sendResponse({content: pageContent});
        } catch (error) {
            console.error('获取页面内容失败:', error);
            sendResponse({content: null, error: error.message});
        }
    }
    return true; // 保持消息通道开放
});

// 获取页面主要内容的函数
function getPageMainContent() {
    // 尝试多种方法获取页面内容
    
    // 方法1: 查找主要内容区域
    const contentSelectors = [
        'article',
        'main',
        '[role="main"]',
        '.content',
        '.main-content',
        '.article-content',
        '.post-content',
        '.entry-content',
        '#content',
        '#main'
    ];
    
    for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
            return element.textContent.trim();
        }
    }
    
    // 方法2: 如果没有找到主要内容区域，获取body内容
    const body = document.body;
    if (body) {
        // 移除脚本和样式标签
        const clonedBody = body.cloneNode(true);
        const scriptsAndStyles = clonedBody.querySelectorAll('script, style, noscript');
        scriptsAndStyles.forEach(el => el.remove());
        
        return clonedBody.textContent.trim();
    }
    
    // 方法3: 最后尝试获取document的文本内容
    return document.body ? document.body.textContent.trim() : document.textContent.trim();
}

// 页面加载完成后注入一些有用的信息
window.addEventListener('load', function() {
    console.log('Page Summarizer content script loaded');
});
