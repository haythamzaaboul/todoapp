import { Router } from 'express';
import {getTodos, createTodo, updateTodo, deleteTodo} from '../controller/todoController.js';
import Auth from '../middleware/auth.js';

const router = Router();
router.get('/',Auth, getTodos);
router.post('/',Auth, createTodo);
router.put('/:id',Auth, updateTodo);
router.delete('/:id',Auth, deleteTodo);

export default router;
