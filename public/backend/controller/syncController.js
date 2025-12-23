import { upsertTodo } from '../services/sync.service.js';

export const syncTodos = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const todo_tobesynced = Array.isArray(req.body.todos) ? req.body.todos : [];
        const db = req.app.locals.db;
        for (const todo of todo_tobesynced) {
            const result = await upsertTodo(userId, todo, db);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Could not sync todos"
                });
            }
        }
        res.status(200).json({ status: "success", message: "Todos synchronized successfully" });
    } catch (err) {
        next(err);
    }
}


export default {syncTodos};
