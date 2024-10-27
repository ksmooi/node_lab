// use PM2 cluster mode to start the server:
//   pm2 start dist/apps/cluster_server/server.js --name "pm2-cluster-app" -i max
//   pm2 stop pm2-cluster-app
//   pm2 start pm2-cluster-app
//   pm2 reload pm2-cluster-app
//   pm2 delete pm2-cluster-app

import cluster from 'cluster';
import http from 'http';

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from process ${process.pid}\n`);
});

server.listen(port, () => {
    console.log(`Server started by process ${process.pid} on port ${port}`);
});
