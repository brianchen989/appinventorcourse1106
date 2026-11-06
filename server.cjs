const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400).end('Bad request'); return; }
  const target = path.resolve(root, '.' + pathname);
  if (!target.startsWith(root + path.sep) && target !== root && target !== path.join(root,'index.html')) { res.writeHead(403).end('Forbidden'); return; }
  fs.stat(target,(err,stat)=>{
    const file = !err && stat.isDirectory() ? path.join(target,'index.html') : (!err ? target : path.join(root,'index.html'));
    fs.readFile(file,(readErr,data)=>{ if(readErr){res.writeHead(404).end('Not found');return;} res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data); });
  });
}).listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log(`Daymark is running at http://127.0.0.1:${Number(process.env.PORT)||4173}`));

