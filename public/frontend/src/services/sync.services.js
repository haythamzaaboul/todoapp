import db from '../loaders/loaders.sqlite.js';

// Return tasks that have not been synced yet (dirty = 0).
export const tasksToBeSynced = async () => {
    const sql = 'SELECT * FROM items WHERE dirty = 0';
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error fetching tasks to sync:', err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export const upsertFromRemote = async (remoteTodos = []) => {
    // Upsert remote tasks by remoteId and mark them as synced (dirty=1).
    const insertSql = `
        INSERT INTO items (taskName, description, status, dirty, remoteId, dueDate, createdAt)
        VALUES (?, ?, ?, 1, ?, ?, ?)
    `;
    const updateSql = `
        UPDATE items
        SET taskName = ?, description = ?, status = ?, dirty = 1, dueDate = ?, createdAt = COALESCE(createdAt, ?)
        WHERE remoteId = ?
    `;
    const selectExisting = 'SELECT id FROM items WHERE remoteId = ?';

    return new Promise((resolve) => {
        db.serialize(() => {
            const checkStmt = db.prepare(selectExisting);
            const insertStmt = db.prepare(insertSql);
            const updateStmt = db.prepare(updateSql);
            let pending = remoteTodos.length;
            let inserted = 0;
            let updated = 0;

            if (pending === 0) {
                checkStmt.finalize();
                insertStmt.finalize();
                updateStmt.finalize();
                resolve({ inserted, updated });
                return;
            }

            const done = () => {
                pending -= 1;
                if (pending === 0) {
                    checkStmt.finalize();
                    insertStmt.finalize();
                    updateStmt.finalize();
                    resolve({ inserted, updated });
                }
            };

            remoteTodos.forEach((todo) => {
                const remoteId = todo.id;
                if (!remoteId) {
                    done();
                    return;
                }
                checkStmt.get(remoteId, (checkErr, row) => {
                    if (checkErr) {
                        console.error('Error checking existing remoteId', checkErr);
                        done();
                        return;
                    }
                    const title = todo.title || todo.taskName || 'Untitled task';
                    const description = todo.description || '';
                    const status = todo.is_completed ? 'completed' : 'pending';
                    const dueDate = todo.due_date || null;
                    const createdAt = todo.created_at || new Date().toISOString();

                    if (row) {
                        updateStmt.run([title, description, status, dueDate, createdAt, remoteId], (updateErr) => {
                            if (updateErr) {
                                console.error('Error updating remote todo', updateErr);
                            } else {
                                updated += 1;
                            }
                            done();
                        });
                        return;
                    }

                    insertStmt.run([title, description, status, remoteId, dueDate, createdAt], (insertErr) => {
                        if (insertErr) {
                            console.error('Error inserting remote todo', insertErr);
                        } else {
                            inserted += 1;
                        }
                        done();
                    });
                });
            });
        });
    });
};

export const markTodosAsSynced = async (ids = []) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        return 0;
    }
    const placeholders = ids.map(() => '?').join(', ');
    const sql = `UPDATE items SET dirty = 1 WHERE id IN (${placeholders})`;

    return new Promise((resolve, reject) => {
        db.run(sql, ids, function(err) {
            if (err) {
                console.error('Error marking todos as synced', err);
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

export default {
    tasksToBeSynced,
    upsertFromRemote,
    markTodosAsSynced
};
