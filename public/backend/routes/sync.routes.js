import { Router } from "express";
import { syncTodos } from "../controller/syncController.js";
import Auth from "../middleware/auth.js";
import TodoValidation from "../middleware/todoValidation.js";


const router = Router();
router.post("/", Auth, TodoValidation('sync'), syncTodos);

export default router;
