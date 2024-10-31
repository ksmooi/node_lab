import { Router } from 'express';
import Controller from './controller';

const router = Router();
const controller = new Controller();

// Create a new user
router.post('/users', (req, res) => controller.createUser(req, res));

// Get a user by ID
router.get('/users/:id', (req, res) => controller.getUserById(req, res));

// Get all users
router.get('/users', (req, res) => controller.getAllUsers(req, res));

// Update a user by ID
router.put('/users/:id', (req, res) => controller.updateUser(req, res));

// Delete a user by ID
router.delete('/users/:id', (req, res) => controller.deleteUser(req, res));

export default router;
