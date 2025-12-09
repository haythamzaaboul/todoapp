import {Router} from "express";
import taskRoutes from "./task.routes.js";


const router = Router();
router.use('/api', taskRoutes);

export default router;