import inquirer from 'inquirer';
import APIService from './apiService';

class CLIClient {
  private apiService: APIService;

  constructor(apiService: APIService) {
    this.apiService = apiService;
  }

  public async start(): Promise<void> {
    console.log('Welcome to the Redis CRUD CLI Client!\n');
    let exit = false;

    while (!exit) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Select an action:',
          choices: [
            'Create/Update a Key',
            'Read a Key',
            'Delete a Key',
            'List All Keys',
            'Exit',
          ],
        },
      ]);

      switch (action) {
        case 'Create/Update a Key':
          await this.createOrUpdateKey();
          break;
        case 'Read a Key':
          await this.readKey();
          break;
        case 'Delete a Key':
          await this.deleteKey();
          break;
        case 'List All Keys':
          await this.listAllKeys();
          break;
        case 'Exit':
          exit = true;
          console.log('Goodbye!');
          break;
      }
    }
  }

  private async createOrUpdateKey(): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'key',
        message: 'Enter the key:',
        validate: (input) => (input ? true : 'Key cannot be empty.'),
      },
      {
        type: 'input',
        name: 'value',
        message: 'Enter the value:',
        validate: (input) => (input ? true : 'Value cannot be empty.'),
      },
    ]);

    try {
      await this.apiService.setKey(answers.key, answers.value);
      console.log(`\nKey '${answers.key}' set successfully.\n`);
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
    }
  }

  private async readKey(): Promise<void> {
    const { key } = await inquirer.prompt([
      {
        type: 'input',
        name: 'key',
        message: 'Enter the key to read:',
        validate: (input) => (input ? true : 'Key cannot be empty.'),
      },
    ]);

    try {
      const value = await this.apiService.getKey(key);
      console.log(`\nValue for key '${key}': ${value}\n`);
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
    }
  }

  private async deleteKey(): Promise<void> {
    const { key } = await inquirer.prompt([
      {
        type: 'input',
        name: 'key',
        message: 'Enter the key to delete:',
        validate: (input) => (input ? true : 'Key cannot be empty.'),
      },
    ]);

    try {
      await this.apiService.deleteKey(key);
      console.log(`\nKey '${key}' deleted successfully.\n`);
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
    }
  }

  private async listAllKeys(): Promise<void> {
    try {
      const keys = await this.apiService.getAllKeys();
      if (keys.length === 0) {
        console.log('\nNo keys found in Redis.\n');
        return;
      }
      console.log('\nKeys in Redis:\n');
      keys.forEach((key, index) => {
        console.log(`${index + 1}. ${key}`);
      });
      console.log('');
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
    }
  }
}

export default CLIClient;
