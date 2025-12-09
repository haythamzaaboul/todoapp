import { getAllTasksController, addTaskController, updateTaskStatusController, deleteTaskController } from "../controllers/task.controller.js";
import { Router } from "express";

const router = Router();

router.get('/tasks', getAllTasksController);
router.post('/tasks', addTaskController);
router.put('/tasks/:id/status', updateTaskStatusController);
router.delete('/tasks/:id', deleteTaskController);

export default router;
