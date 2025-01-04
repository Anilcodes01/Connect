import express from 'express'
import { getUsers, searchUsers } from '../controllers/userController'

const router = express.Router();

router.get('/getAllUsers', getUsers);
router.get('/search', searchUsers)

export default router;