// importScripts('./postcss-web-worker.js');
// importScripts('./postcss-plugins/autoprefix-web-worker.js');
import './postcss-web-worker.js';
import './postcss-plugins/autoprefix-web-worker.js';

// console.log('PostCSS Worker 已加载');

// 存储主线程传递的 PostCSS 配置
let postcssConfig = null;
let postcssAvailable = true;
let autoprefixerAvailable = true;

// console.log('self', self);

// 监听主线程消息
self.addEventListener('message', async function(e) {
    const { type, data, options = {} } = e.data;
  
    switch (type) {
        case 'init':
            // 接收主线程传递的 PostCSS 配置
            try {
                postcssConfig = data.config;
                console.log('PostCSS 配置已接收:', postcssConfig);
                
                self.postMessage({
                    type: 'init_success',
                    message: 'PostCSS 配置初始化成功',
                    postcssAvailable: postcssAvailable,
                    autoprefixerAvailable: autoprefixerAvailable
                });
            } catch (error) {
                self.postMessage({
                    type: 'init_error',
                    error: `初始化失败: ${error.message}`
                });
            }
            break;
            
        case 'transform':
            // 执行 CSS 转换
            try {
                if (!postcssAvailable) {
                    throw new Error('PostCSS 未可用');
                }
                
                console.log('开始执行 PostCSS 转换');
                const result = await executeTransform(data, options);
                
                self.postMessage({
                    type: 'transform_success',
                    data: result,
                    originalInput: data
                });
            } catch (error) {
                console.error('转换失败:', error);
                self.postMessage({
                    type: 'transform_error',
                    error: error.message,
                    stack: error.stack
                });
            }
            break;
            
        case 'getStatus':
            // 返回当前状态
            self.postMessage({
                type: 'status',
                data: {
                    initialized: !!postcssConfig,
                    config: postcssConfig,
                    postcssAvailable: postcssAvailable,
                    autoprefixerAvailable: autoprefixerAvailable
                }
            });
            break;
            
        default:
            self.postMessage({
                type: 'error',
                error: `未知的消息类型: ${type}`
            });
    }
});

// 执行 PostCSS 转换
async function executeTransform(input, options = {}) {
    try {
        const { css, from, to, map = false } = options;
        const cssToProcess = css || input;
        
        console.log('处理 CSS:', cssToProcess.substring(0, 100) + '...');
        
        let processor = self.postcss();
        
        if (postcssConfig && postcssConfig.plugins) {
            const plugins = [];
            
            if (postcssConfig.plugins.autoprefixer && autoprefixerAvailable) {
                plugins.push(self.autoprefixer());
            }
            
            if (plugins.length > 0) {
                processor = self.postcss(plugins);
            }
        }
        
        // 处理 CSS
        const result = await processor.process(cssToProcess, {
            from: from || 'input.css',
            to: to || 'output.css',
            map: map
        });
        
        console.log('PostCSS 处理完成');
        
        return {
            css: result.css,
            map: result.map,
            messages: result.messages || [],
            warnings: result.warnings() || [],
            processed: true,
            timestamp: new Date().toISOString(),
            config: postcssConfig,
            autoprefixerUsed: autoprefixerAvailable
        };
        
    } catch (error) {
        console.error('PostCSS 转换错误:', error);
        throw new Error(`转换失败: ${error.message}`);
    }
}

// 导出函数供外部调用
self.executeTransform = executeTransform;
self.runTests = runTests; 