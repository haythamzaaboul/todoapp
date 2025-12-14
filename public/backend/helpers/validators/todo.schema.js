import {z} from 'zod';

export const addTodoSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    is_completed: z.boolean().optional(),
    due_date: z.string().optional(), // ISO date string
});

export const updateTodoSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    is_completed: z.boolean().optional(),
    due_date: z.string().optional(), // ISO date string
});

export const deleteTodoSchema = z.object({
    id: z.number().int().positive(),
});

export const getTodoSchema = z.object({
    id: z.number().int().positive(),
});

export const getTodosSchema = z.object({
    user_id: z.number().int().positive(),
});

export default {
    addTodoSchema,
    updateTodoSchema,
    deleteTodoSchema,
    getTodoSchema,
    getTodosSchema
};