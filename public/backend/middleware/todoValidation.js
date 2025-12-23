import { todoCreateSchema, todoUpdateSchema, todoSyncSchema } from '../helpers/validators/todo.schema.js';

export default function TodoValidation(mode = 'create') {
    return (req, res, next) => {
        try {
            switch (mode) {
                case 'update':
                    todoUpdateSchema.parse(req.body);
                    break;
                case 'sync':
                    todoSyncSchema.parse(req.body);
                    break;
                default:
                    todoCreateSchema.parse(req.body);
            }
            return next();
        } catch (err) {
            const message = err?.errors ? err.errors.map((e) => e.message).join(', ') : err.message;
            return res.status(400).json({
                status: 'fail',
                message: message || 'Invalid request payload',
            });
        }
    };
}
