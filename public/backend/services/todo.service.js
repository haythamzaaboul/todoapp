const getTodos = async (userId, db) => {
    const q = 'SELECT * FROM todos WHERE user_id = $1';
    const result = await db.query(q, [userId]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows;
}

const getTodobyId = async (Id, db) => {
    const q = 'SELECT * FROM todos WHERE id = $1';
    const {rows} = await db.query(q, [Id]);
    return rows[0];
}


const createTodo = async (userId, title, description, due_date, db) => {
    const q = `
        INSERT INTO todos (user_id, title, description, due_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const {rows} = await db.query(q, [userId, title, description, due_date]);
    return rows[0];
};


const updateTodo = async (todoId, title, description, is_completed, due_date, db) => {
    const q = `
        UPDATE todos
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            is_completed = COALESCE($3, is_completed),
            due_date = COALESCE($4, due_date)
        WHERE id = $5
        RETURNING *;
    `;
    const {rows} = await db.query(q, [title, description, is_completed, due_date, todoId]);
    return rows[0];
};


const deleteTodo = async (todoId, db) => {
    const q = `
        DELETE FROM todos
        WHERE id = $1
        RETURNING *;
    `;
    const {rows} = await db.query(q, [todoId]);
    return rows[0];
};



export default {getTodos, getTodobyId, createTodo, updateTodo, deleteTodo};
