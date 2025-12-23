import { z } from 'zod';

const baseFields = {
    description: z.string().max(2000).optional().nullable(),
    is_completed: z.boolean().optional(),
    due_date: z.string().datetime().optional().nullable(),
};

export const todoCreateSchema = z.object({
    title: z.string().min(1).max(255),
    ...baseFields,
});

export const todoUpdateSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    ...baseFields,
}).refine((data) => Object.keys(data).length > 0, { message: 'Update payload cannot be empty' });

const todoSyncItemSchema = z.object({
    id: z.number().int().positive().optional(),
    title: z.string().min(1).max(255).optional(),
    taskName: z.string().min(1).max(255).optional(),
    description: z.string().max(2000).optional().nullable(),
    is_completed: z.boolean().optional(),
    due_date: z.string().datetime().optional().nullable(),
}).refine((data) => data.title || data.taskName, { message: 'Each todo must include a title or taskName' });

export const todoSyncSchema = z.object({
    todos: z.array(todoSyncItemSchema).default([]),
});
