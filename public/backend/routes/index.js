import {Router} from 'express';
import userRoutes from './user.routes.js'; 
import todoRoutes from './todo.route.js';

const router = Router();

router.use('/user', userRoutes);
 
router.use('/todo', todoRoutes);
export default router; 
