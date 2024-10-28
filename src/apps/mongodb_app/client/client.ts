// npx ts-node src/apps/mongodb_app/client/client.ts

import BlogClient from './blogClient';
import ApiService from './apiService';

const main = async () => {
  const apiService = new ApiService('http://192.168.1.150:5001');
  const blogClient = new BlogClient(apiService);
  await blogClient.start();
};

main();
