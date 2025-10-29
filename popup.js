
// 显示成功消息的函数
function showSuccessMessage(message, buttonElement) {
    // 创建成功消息元素
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    // 显示消息
    setTimeout(() => messageEl.classList.add('show'), 10);
    
    // 按钮特效
    if (buttonElement) {
        buttonElement.classList.add('btn-success');
        setTimeout(() => buttonElement.classList.remove('btn-success'), 600);
    }
    
    // 3秒后移除消息
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => document.body.removeChild(messageEl), 300);
    }, 2000);
}

// 显示错误消息的函数
function showErrorMessage(message, buttonElement) {
    // 创建错误消息元素
    const messageEl = document.createElement('div');
    messageEl.className = 'error-message';
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    // 显示消息
    setTimeout(() => messageEl.classList.add('show'), 10);
    
    // 按钮特效
    if (buttonElement) {
        buttonElement.classList.add('btn-error');
        setTimeout(() => buttonElement.classList.remove('btn-error'), 500);
    }
    
    // 3秒后移除消息
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => document.body.removeChild(messageEl), 300);
    }, 3000);
}

// 显示复制成功特效
function showCopySuccess(buttonElement) {
    buttonElement.classList.add('copy-success');
    showSuccessMessage('已复制到剪贴板', buttonElement);
    setTimeout(() => buttonElement.classList.remove('copy-success'), 800);
}


// 格式化AI响应内容的函数
function formatAIResponse(text) {
    if (!text) return '';
    
    // 处理换行和段落
    let formatted = text
        .replace(/\n\s*\n/g, '</p><p>') // 双换行转为段落
        .replace(/\n/g, '<br>') // 单换行转为换行标签
        .replace(/^/, '<p>') // 开头加段落标签
        .replace(/$/, '</p>'); // 结尾加段落标签
    
    // 处理列表项
    formatted = formatted.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>\s*)+/g, '<ul>$&</ul>');
    
    // 处理数字列表
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    
    // 处理加粗文本
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // 处理斜体文本
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // 处理标题
    formatted = formatted.replace(/^#{1,3}\s+(.+)$/gm, function(match, title) {
        const level = match.match(/^#+/)[0].length;
        return `<h${level}>${title}</h${level}>`;
    });
    
    return formatted;
}

// Tab Switching Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Show summary tab by default
    if (tabContents.length > 0) {
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById('summary-tab').classList.add('active');
    }
    
    if (tabs.length > 0) {
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('.tab[data-target="summary-tab"]').classList.add('active');
    }
    
    // Tab click handler
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Remove active class from all tabs and content
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to selected tab and content
            this.classList.add('active');
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Summarize button functionality
    const summarizeBtn = document.getElementById('summarize-btn');
    if (summarizeBtn) {
        summarizeBtn.addEventListener('click', function() {
            console.log('Summarize button clicked');
            const resultDiv = document.getElementById('summary-result');
            if (resultDiv) {
                resultDiv.innerHTML = '正在获取页面内容...';
                
                // Get current tab content
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0]) {
                        const currentUrl = tabs[0].url;
                        
                        // Get page content using content script
                        chrome.tabs.sendMessage(tabs[0].id, {action: 'getPageContent'}, function(response) {
                            if (chrome.runtime.lastError) {
                                resultDiv.innerHTML = '错误：无法获取页面内容。请刷新页面后重试。';
                                return;
                            }
                            
                            if (response && response.content) {
                                resultDiv.innerHTML = '正在生成AI总结...';
                                callAIAPI(response.content, currentUrl, resultDiv);
                            } else {
                                resultDiv.innerHTML = '错误：页面内容为空或无法访问。';
                            }
                        });
                    } else {
                        resultDiv.innerHTML = '错误：无法获取当前页面信息。';
                    }
                });
            }
        });
    }
    
    // Copy button functionality
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const resultDiv = document.getElementById('summary-result');
            if (resultDiv) {
                const textToCopy = resultDiv.innerText;
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showCopySuccess(copyBtn);
                    }).catch(err => {
                        console.error('复制失败:', err);
                        showErrorMessage('复制失败，请手动复制', copyBtn);
                    });
                }
            }
        });
    }
    
    // Save config functionality
    const saveConfigBtn = document.getElementById('save-config');
    if (saveConfigBtn) {
        saveConfigBtn.addEventListener('click', function() {
            const apiUrl = document.getElementById('api-url');
            const apiKey = document.getElementById('api-key');
            const modelName = document.getElementById('model-name');
            
            if (apiUrl && apiKey && modelName) {
                const url = apiUrl.value.trim();
                const key = apiKey.value.trim();
                const model = modelName.value.trim();
                
                if (url && key && model) {
                    // Process API URL (add /chat/completions if needed)
                    let processedUrl = url;
                    if (!url.endsWith('/chat/completions')) {
                        processedUrl = url.replace(/\/$/, '') + '/chat/completions';
                    }
                    
                    // Save to localStorage
                    localStorage.setItem('apiUrl', processedUrl);
                    localStorage.setItem('apiKey', key);
                    localStorage.setItem('modelName', model);
                    
                    showSuccessMessage('配置保存成功', saveConfigBtn);
                    console.log('API URL:', processedUrl);
                    console.log('Model Name:', model);
                    console.log('API Key saved');
                } else {
                    showErrorMessage('请填写完整的API配置信息', saveConfigBtn);
                }
            }
        });
    }
    
    // Load saved config on startup
    const savedUrl = localStorage.getItem('apiUrl');
    const savedKey = localStorage.getItem('apiKey');
    const savedModel = localStorage.getItem('modelName');
    
    const baseUrlInput = document.getElementById('api-url');
    const apiKeyInput = document.getElementById('api-key');
    const modelNameInput = document.getElementById('model-name');
    
    if (baseUrlInput) {
        // 如果有保存的配置，使用保存的值
        if (savedUrl) {
            baseUrlInput.value = savedUrl.replace('/chat/completions', '');
        }
        // 如果没有保存的配置，保持默认值
    }
    
    if (apiKeyInput && savedKey) {
        apiKeyInput.value = savedKey;
    }
    
    if (modelNameInput) {
        // 如果有保存的配置，使用保存的值
        if (savedModel) {
            modelNameInput.value = savedModel;
        }
        // 如果没有保存的配置，保持默认值"auto"
    }
});

// E-commerce detection function
function isEcommercePage(url) {
    const ecommerceDomains = [
        'taobao.com', 'tmall.com', 'item.taobao.com', 'detail.tmall.com',
        'jd.com', 'item.jd.com', 'item.m.jd.com',
        'suning.com', 'product.suning.com',
        'pinduoduo.com', 'yangkeduo.com', 'mobile.yangkeduo.com',
        'vip.com', 'item.vip.com',
        'dangdang.com', 'product.dangdang.com'
    ];
    return ecommerceDomains.some(domain => url.includes(domain));
}

// Get system prompt based on page type
function getSystemPrompt(url) {
    let basePrompt = '请总结当前页面的主要内容，包括关键信息和重要观点。';
    
    if (isEcommercePage(url)) {
        basePrompt = '请详细分析和总结这个电商商品页面的所有重要信息。\n\n';
        basePrompt += '务必要提取以下关键信息：\n\n';
        basePrompt += '【商品基本信息】\n';
        basePrompt += '- 商品名称（完整标题）\n';
        basePrompt += '- 品牌信息\n';
        basePrompt += '- 价格信息\n\n';
        
        basePrompt += '【产品参数详情】\n';
        basePrompt += '- 规格参数（尺寸、重量、颜色、材质等）\n';
        basePrompt += '- 技术参数（如适用：功率、容量、性能指标等）\n';
        basePrompt += '- 包装信息\n';
        basePrompt += '- 产地信息\n\n';
        
        basePrompt += '【核心卖点】\n';
        basePrompt += '- 产品主要特色和优势\n';
        basePrompt += "- 厂商宣传的核心卖点\n";
        basePrompt += '- 与同类产品的差异化优势\n\n';
        
        basePrompt += '【用户评价信息】\n';
        basePrompt += '- 整体评价概况（好评率、评分）\n';
        basePrompt += '- 用户提及最多的优点\n';
        basePrompt += '- 用户反映的主要问题或缺点\n';
        basePrompt += '- 购买建议和推荐度\n\n';
        
        basePrompt += '【其他重要信息】\n';
        basePrompt += '- 售后服务政策\n';
        basePrompt += '- 物流配送信息\n';
        basePrompt += '- 促销活动详情\n';
        basePrompt += '- 适用人群和使用场景\n\n';
        
        basePrompt += '请以结构化的方式整理这些信息，确保内容准确、完整且易于阅读。';
    }
    
    return basePrompt;
}

// Process API URL function
function processApiUrl(baseUrl) {
    if (!baseUrl) return '';
    
    baseUrl = baseUrl.trim();
    if (baseUrl.endsWith('/chat/completions')) {
        return baseUrl;
    }
    
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }
    
    return baseUrl + '/chat/completions';
}


// AI API调用函数
async function callAIAPI(pageContent, url, resultDiv) {
    try {
        // 获取保存的配置
        const apiUrl = localStorage.getItem('apiUrl');
        const apiKey = localStorage.getItem('apiKey');
        const modelName = localStorage.getItem('modelName') || 'gpt-3.5-turbo';
        
        if (!apiUrl || !apiKey) {
            resultDiv.innerHTML = '请先在配置页面设置API地址和密钥。';
            return;
        }
        
        // 获取系统提示词
        const systemPrompt = getSystemPrompt(url);
        
        // 准备请求数据
        const requestData = {
            model: modelName,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: `请总结以下网页内容：\n\n${pageContent.substring(0, 8000)}`
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        };
        
        // 发送API请求
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const summary = data.choices[0].message.content;
            const formattedSummary = formatAIResponse(summary);
            resultDiv.innerHTML = formattedSummary;
            
            // 显示复制按钮
            const copyBtn = document.getElementById('copy-btn');
            if (copyBtn) {
                copyBtn.style.display = 'block';
            }
        } else {
            resultDiv.innerHTML = 'API响应格式错误，请检查API配置。';
        }
        
    } catch (error) {
        console.error('API调用错误:', error);
        resultDiv.innerHTML = `API调用失败: ${error.message}`;
    }
}
