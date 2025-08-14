// worker.js - Web Worker 文件
// 直接使用本地的 PostCSS web-worker 产物

// 导入本地的 PostCSS web-worker 产物
// importScripts('./postcss-web-worker.js');
// import './postcss-web-worker.js';

// 调试信息
console.log('Worker 已加载');
console.log('检查 PostCSS 可用性:', {
  postcss: typeof self.postcss,
  webpackExports: typeof self.__webpack_exports__
});

// 监听主线程消息
self.addEventListener('message', async function(e) {
  const { type, css } = e.data;
  
  if (type === 'transform') {
    try {
      console.log('收到转换请求');
      // 使用 PostCSS 处理 CSS
      const result = await processCSS(css);
      
      // 发送成功消息回主线程
      self.postMessage({
        type: 'success',
        data: result,
        originalCSS: css
      });
    } catch (error) {
      console.error('处理失败:', error);
      // 发送错误消息回主线程
      self.postMessage({
        type: 'error',
        error: error.message
      });
    }
  }
});

// PostCSS 处理函数
async function processCSS(css) {
  try {
    console.log('开始处理 CSS');
    
    // 检查 PostCSS 是否可用
    if (typeof self.postcss === 'undefined') {
      throw new Error('PostCSS 未正确加载');
    }
    
    console.log('PostCSS 实例:', self.postcss);
    
    const result = await self.postcss([]).process(css, {
      from: undefined,
      to: undefined
    });

    console.log('处理完成');
    return result.css;
  } catch (error) {
    console.error('PostCSS 处理错误:', error);
    throw new Error(`PostCSS 处理失败: ${error.message}`);
  }
} 