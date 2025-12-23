import { Router } from "express";
import { listTodosToSync, importRemoteTodos, markSyncedTodos } from "../controllers/syncController.js";

const router = Router();
router.get("/", listTodosToSync);
router.post("/import", importRemoteTodos);
router.post("/mark", markSyncedTodos);

export default router;
