// 使用简单的消息处理，确保响应总是被发送
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    handleSummarizeRequest(request, sendResponse);
    return true; // 保持消息通道开放
  }
});

// 处理总结请求的函数
async function handleSummarizeRequest(request, sendResponse) {
  try {
    console.log('收到总结请求:', request);
    
    // 验证配置
    if (!request.config || !request.config.apiKey || !request.config.baseUrl || !request.config.modelName) {
      throw new Error('API配置不完整');
    }

    // 获取当前活动标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) throw new Error('无法获取当前标签页');
    console.log('当前标签页:', tab.title, tab.url);

    // 检查页面是否允许访问
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
      throw new Error('无法访问浏览器内部页面');
    }

    // 直接注入脚本提取内容（最可靠的方式）
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageContent
    });

    const pageContent = result.result;
    if (!pageContent) throw new Error('无法提取页面内容');
    console.log('提取到的内容长度:', pageContent.length);

    // 调用OpenAI类API总结内容
    const summary = await callOpenAI(request.config, pageContent);
    
    // 发送成功响应
    sendResponse({ success: true, summary });
    console.log('总结完成');
  } catch (error) {
    console.error('处理总结请求出错:', error);
    // 确保总是发送错误响应
    sendResponse({ 
      success: false, 
      error: error.message,
      details: error.stack 
    });
  }
}

// 提取页面主要内容的函数
function extractPageContent() {
  try {
    // 优先提取文章类内容
    const article = document.querySelector('article');
    if (article) return article.innerText.trim();

    // 提取正文内容（排除导航、广告等）
    const mainContent = document.querySelector('main') || document.body;
    return mainContent.innerText.trim().replace(/\s+/g, ' ').substring(0, 10000); // 限制内容长度
  } catch (error) {
    console.error('提取页面内容出错:', error);
    return null;
  }
}

// 调用OpenAI类API的函数
async function callOpenAI(config, content) {
  try {
    console.log('调用API:', config.baseUrl);
    
    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.modelName,
        messages: [
          { role: 'system', content: '你是一个专业的内容总结助手，需要将网页内容提炼为简洁明了的总结，保持关键信息完整，语言流畅自然。' },
          { role: 'user', content: `请总结以下网页内容：\n\n${content}` }
        ],
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }),
      timeout: 30000 // 30秒超时
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API请求失败 [${response.status}]: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('API调用出错:', error);
    throw error;
  }
}