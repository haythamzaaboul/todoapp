import todoService from '../services/todo.service.js';

export const getTodos = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const db = req.app.locals.db;
        const todos = await todoService.getTodos(userId, db);
        if (!todos) {
            return res.status(404).json({
                status: "fail",
                message: "No todos found for this user"
            });
        }
        res.status(200).json({ status: "success", data: todos });
    } catch (err) {
        next(err);
    }
}


export const getTodoById = async (req, res, next) => {
    try {
        const todoId = req.params.id;
        const userId = req.user.id;
        const db = req.app.locals.db;
        const todo = await todoService.getTodobyId(todoId, userId, db);
        if (!todo) {
            return res.status(404).json({
                status: "fail",
                message: "Todo not found"
            });
        }
        res.status(200).json({ status: "success", data: todo });
    } catch (err) {
        next(err);
    }
}


export const createTodo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, description, due_date } = req.body;
        const db = req.app.locals.db;
        const todo = await todoService.createTodo(userId, title, description, due_date, db);
        if (!todo) {
            return res.status(400).json({
                status: "fail",
                message: "Could not create todo"
            });
        }
        res.status(201).json({ status: "success", data: todo });
    } catch (err) {
        next(err);
    }   
}


export const updateTodo = async (req, res, next) => {
    try {
        const todoId = req.params.id;
        const userId = req.user.id;
        const { title, description, is_completed, due_date } = req.body;
        const db = req.app.locals.db;
        const todo = await todoService.updateTodo(todoId, userId, title, description, is_completed, due_date, db);
        if (!todo) {
            return res.status(404).json({
                status: "fail",
                message: "Todo not found or could not be updated"
            });
        }
        res.status(200).json({ status: "success", data: todo });
    } catch (err) {
        next(err);
    }   
}


export const deleteTodo = async (req, res, next) => {
    try {
        const todoId = req.params.id;
        const userId = req.user.id;
        const db = req.app.locals.db;
        const todo = await todoService.deleteTodo(todoId, userId, db);
        if (!todo) {
            return res.status(404).json({
                status: "fail",
                message: "Todo not found or could not be deleted"
            });
        }
        res.status(200).json({ status: "success", data: todo });
    } catch (err) {
        next(err);
    }   
}


export default {getTodos, getTodoById, createTodo, updateTodo, deleteTodo};
