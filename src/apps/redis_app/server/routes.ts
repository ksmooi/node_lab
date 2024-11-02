import { Router } from 'express';
import Controller from './controller';

const router = Router();
const controller = new Controller();

// Route to set a key-value pair
router.post('/set', (req, res) => controller.setKey(req, res));

// Route to get a key's value
router.get('/get/:key', (req, res) => controller.getKey(req, res));

// Route to delete a key
router.delete('/delete/:key', (req, res) => controller.deleteKey(req, res));

// Route to get all keys
router.get('/keys', (req, res) => controller.getAllKeys(req, res));

export default router;
