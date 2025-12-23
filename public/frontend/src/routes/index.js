import {Router} from "express";
import taskRoutes from "./task.routes.js";
import syncRoutes from "./tobesynced.js";


const router = Router();
router.use('/api', taskRoutes);
router.use('/api/sync', syncRoutes);

export default router;