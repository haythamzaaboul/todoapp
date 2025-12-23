import { Router } from 'express';
import {getTodos, createTodo, updateTodo, deleteTodo} from '../controller/todoController.js';
import Auth from '../middleware/auth.js';
import TodoValidation from '../middleware/todoValidation.js';

const router = Router();
router.get('/',Auth, getTodos);
router.post('/',Auth, TodoValidation('create'), createTodo);
router.put('/:id',Auth, TodoValidation('update'), updateTodo);
router.delete('/:id',Auth, deleteTodo);

export default router;
