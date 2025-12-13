import {Router} from 'express';
import userRoutes from './user.routes.js'

const router = Router();

router.use('/user', userRoutes); 
// add the task routes when its done.
export default router; 
