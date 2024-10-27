// npx ts-node src/apps/cluster_server/client.ts

import http from 'http';

const loadBalancerUrl = 'http://localhost:3000';
const totalRequests = 10;

// Function to send HTTP GET request
function sendRequest(requestNumber: number) {
    return new Promise<void>((resolve, reject) => {
        const req = http.get(loadBalancerUrl, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(`Response #${requestNumber}: ${data.trim()}`);
                resolve();
            });
        });

        req.on('error', (err) => {
            console.error(`Request #${requestNumber} failed:`, err.message);
            reject(err);
        });
    });
}

// Send multiple requests concurrently
async function testLoadBalancer() {
    const requestPromises = [];
    for (let i = 1; i <= totalRequests; i++) {
        requestPromises.push(sendRequest(i));
    }
    await Promise.all(requestPromises);
    console.log('Load balancer test completed.');
}

testLoadBalancer();
