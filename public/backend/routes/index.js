import {Router} from 'express';
import userRoutes from './user.routes.js'; 
import todoRoutes from './todo.routes.js';
import syncRoutes from './sync.routes.js';

const router = Router();

router.use('/user', userRoutes);
 
router.use('/todo', todoRoutes);
router.use('/todo/sync', syncRoutes);
export default router; 
