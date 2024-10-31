import inquirer from 'inquirer';
import APIService from './apiService';

class CLIClient {
  private apiService: APIService;

  constructor(apiService: APIService) {
    this.apiService = apiService;
  }

  public async start(): Promise<void> {
    console.log('Welcome to the PostgreSQL CRUD CLI Client!\n');
    let exit = false;

    while (!exit) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Select an action:',
          choices: [
            'Create a New User',
            'View a User by ID',
            'View All Users',
            'Update a User',
            'Delete a User',
            'Exit',
          ],
        },
      ]);

      switch (action) {
        case 'Create a New User':
          await this.createUser();
          break;
        case 'View a User by ID':
          await this.viewUserById();
          break;
        case 'View All Users':
          await this.viewAllUsers();
          break;
        case 'Update a User':
          await this.updateUser();
          break;
        case 'Delete a User':
          await this.deleteUser();
          break;
        case 'Exit':
          exit = true;
          console.log('Goodbye!');
          break;
      }
    }
  }

  private async createUser(): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the user name:',
        validate: (input) => (input ? true : 'Name cannot be empty.'),
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter the user email:',
        validate: (input) => {
          const valid = /\S+@\S+\.\S+/.test(input);
          return valid ? true : 'Please enter a valid email address.';
        },
      },
      {
        type: 'number',
        name: 'age',
        message: 'Enter the user age:',
        validate: (input) => (input > 0 ? true : 'Age must be a positive number.'),
      },
    ]);

    try {
      await this.apiService.createUser(answers.name, answers.email, answers.age);
      console.log(`\nUser '${answers.name}' created successfully.\n`);
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
    }
  }

  private async viewUserById(): Promise<void> {
    const { id } = await inquirer.prompt([
      {
        type: 'number',
        name: 'id',
        message: 'Enter the user ID:',
        validate: (input) => (input > 0 ? true : 'ID must be a positive number.'),
      },
    ]);

    try {
      const user = await this.apiService.getUserById(id);
      console.log('\nUser Details:\n', user, '\n');
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
    }
  }

  private async viewAllUsers(): Promise<void> {
    try {
      const users = await this.apiService.getAllUsers();
      if (users.length === 0) {
        console.log('\nNo users found.\n');
        return;
      }
      console.log('\nAll Users:\n');
      users.forEach((user) => {
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Age: ${user.age}`);
        console.log(`Created At: ${user.created_at}`);
        console.log('-------------------------');
      });
      console.log('');
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
    }
  }

  private async updateUser(): Promise<void> {
    const { id } = await inquirer.prompt([
      {
        type: 'number',
        name: 'id',
        message: 'Enter the user ID to update:',
        validate: (input) => (input > 0 ? true : 'ID must be a positive number.'),
      },
    ]);

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the new name:',
        validate: (input) => (input ? true : 'Name cannot be empty.'),
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter the new email:',
        validate: (input) => {
          const valid = /\S+@\S+\.\S+/.test(input);
          return valid ? true : 'Please enter a valid email address.';
        },
      },
      {
        type: 'number',
        name: 'age',
        message: 'Enter the new age:',
        validate: (input) => (input > 0 ? true : 'Age must be a positive number.'),
      },
    ]);

    try {
      await this.apiService.updateUser(id, answers.name, answers.email, answers.age);
      console.log(`\nUser ID '${id}' updated successfully.\n`);
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
    }
  }

  private async deleteUser(): Promise<void> {
    const { id } = await inquirer.prompt([
      {
        type: 'number',
        name: 'id',
        message: 'Enter the user ID to delete:',
        validate: (input) => (input > 0 ? true : 'ID must be a positive number.'),
      },
    ]);

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete user ID '${id}'?`,
        default: false,
      },
    ]);

    if (!confirm) {
      console.log('\nDeletion cancelled.\n');
      return;
    }

    try {
      await this.apiService.deleteUser(id);
      console.log(`\nUser ID '${id}' deleted successfully.\n`);
    } catch (error: any) {
      console.error(`\nError: ${error.message}\n`);
    }
  }
}

export default CLIClient;
