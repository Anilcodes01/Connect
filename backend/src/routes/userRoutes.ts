import express from 'express'
import { getUsers } from '../controllers/userController'

const router = express.Router();

router.get('/getAllUsers', getUsers);

export default router;