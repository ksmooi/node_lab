// npx ts-node src/apps/mysql_app/client/client.ts

import APIService from './apiService';
import CLIClient from './cliClient';

const main = async () => {
  const baseURL = 'http://192.168.1.150:5004/api';
  const apiService = new APIService(baseURL);
  const cliClient = new CLIClient(apiService);
  await cliClient.start();
};

main();
