// npx ts-node src/apps/pgsql_app/client/client.ts

import APIService from './apiService';
import CLIClient from './cliClient';
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  const baseURL = process.env.SERVER_BASE_URL || 'http://192.168.1.150:5003/api';
  const apiService = new APIService(baseURL);
  const cliClient = new CLIClient(apiService);
  await cliClient.start();
};

main();