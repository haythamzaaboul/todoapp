// Upsert a todo into Postgres using the remote id when provided.
export const upsertTodo = async (userId, todo, db) => {
    const { id, title, taskName, description, is_completed = false, due_date = null } = todo;
    const normalizedTitle = title ?? taskName;
    if (!normalizedTitle) {
        throw new Error('Todo title is required for sync.');
    }
    try {
        if (id) {
            const q = `
                INSERT INTO todos (id, user_id, title, description, is_completed, due_date)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO UPDATE
                SET title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    is_completed = EXCLUDED.is_completed,
                    due_date = EXCLUDED.due_date
                WHERE todos.user_id = EXCLUDED.user_id
                RETURNING *;
            `;
            const values = [id, userId, normalizedTitle, description, is_completed, due_date];
            const { rows } = await db.query(q, values);
            return rows[0];
        } else {
            const q = `
                INSERT INTO todos (user_id, title, description, is_completed, due_date)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [userId, normalizedTitle, description, is_completed, due_date];
            const { rows } = await db.query(q, values);
            return rows[0];
        }
    } catch (err) {
        console.error('Error syncing todo:', err);
        return null;
    }
};

export default { upsertTodo };
