const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 提供静态文件服务
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📁 打开浏览器访问上面的地址来查看 demo`);
}); 