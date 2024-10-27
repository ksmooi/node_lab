// npx ts-node src/apps/cluster_server/clusterManager.ts

import cluster from 'cluster';
import os from 'os';
import http from 'http';

const port = process.env.PORT || 3000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new one.`);
        cluster.fork(); // Automatically restart the worker on failure
    });
} else {
    // Workers share the same TCP connection in this server
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Hello from worker ${process.pid}\n`);
    }).listen(port, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
