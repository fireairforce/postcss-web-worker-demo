// main.js - 主线程文件
document.addEventListener('DOMContentLoaded', () => {
  const cssInput = document.getElementById('cssInput');
  const transformBtn = document.getElementById('transformBtn');
  const resultOutput = document.getElementById('resultOutput');
  const statusDiv = document.getElementById('status');

  // 创建 Web Worker
  const worker = new Worker('./dist/static/js/postcss-transform-web-worker.js');

  // 监听 worker 消息
  worker.onmessage = function(e) {
    const { type, data, error } = e.data;
    
    if (type === 'success') {
      resultOutput.value = data;
      statusDiv.textContent = '✅ CSS 转换成功！';
      statusDiv.className = 'status success';
    } else if (type === 'error') {
      statusDiv.textContent = `❌ 错误: ${error}`;
      statusDiv.className = 'status error';
    }
  };

  // 监听 worker 错误
  worker.onerror = function(error) {
    statusDiv.textContent = `❌ Worker 错误: ${error.message}`;
    statusDiv.className = 'status error';
  };

  // 转换按钮点击事件
  transformBtn.addEventListener('click', () => {
    const css = cssInput.value.trim();
    
    if (!css) {
      statusDiv.textContent = '⚠️ 请输入 CSS 代码';
      statusDiv.className = 'status warning';
      return;
    }

    statusDiv.textContent = '⏳ 正在转换中...';
    statusDiv.className = 'status processing';

    // 发送消息给 worker
    worker.postMessage({
      type: 'transform',
      css: css
    });
  });

  // 示例 CSS 代码
  const exampleCSS = `/* 示例 CSS 代码 */
.example {
  display: flex;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.example:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* 使用一些现代 CSS 特性 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

@media (max-width: 768px) {
  .example {
    padding: 15px;
    margin: 5px;
  }
}`;

  cssInput.value = exampleCSS;
}); 