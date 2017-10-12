const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const mime = require('./MIME');
const PORT = 8000;

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  const realPath = `assets${pathname}`;
  const ISEXIST = fs.existsSync(realPath);

  if(ISEXIST){
    const extname = path.extname(pathname).slice(1);    
    fs.readFile(realPath, (err, data) => {
      if (err) throw err;
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': mime[extname]
      });
      res.end(data);
    });
  }else{
    res.writeHead(400)
    res.end('Source not found')
  }
  
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(PORT);

console.log('\n\n--------------------')
console.log(`Server running in port ${PORT}`)
console.log('--------------------')