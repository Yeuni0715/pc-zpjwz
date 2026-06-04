const http = require('http');
const fs = require('fs');
const path = require('path');

// 使用作品集网站文件夹作为网站根目录
const basePath = 'd:\\作品集网站';

const server = http.createServer((req, res) => {
    let filePath = req.url;
    if (filePath === '/') filePath = '/index.html';
    
    // 构建绝对路径
    const absolutePath = path.join(basePath, filePath);
    
    console.log('Request URL:', req.url);
    console.log('Absolute path:', absolutePath);
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
    }
    
    fs.readFile(absolutePath, (error, content) => {
        if (error) {
            console.log('Error:', error.code, '-', absolutePath);
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found: ' + filePath);
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            console.log('Served:', absolutePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(2045, '0.0.0.0', () => {
    console.log('Server running on http://localhost:2045');
});