import db from '../loaders/loaders.sqlite.js';

const getAllTasks = async () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM items';
        db.all(sql, [],(err, rows) => {
            if(err){
                reject(err);                
            }else {
                resolve(rows);
            }
        });
    });
};

// status by default is 'pending'
const addTask = async (taskName, description) => {
    const sql = 'INSERT INTO items (taskName, description, status, dirty) VALUES (?, ?, "pending", 0)';
    return new Promise((resolve, reject) => {
        db.run(sql, [taskName, description], function(err) {
            if (err) {
                reject(err);
            } else {
                console.log('Task added with ID:', this.lastID);
                resolve({ id: this.lastID });
            }
        });
    });
};



const updateTaskStatus = async (id, status) => {
    const sql = 'UPDATE items SET status = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.run(sql, [status, id], function(err) {
            if (err) {
                console.error('Error updating task status:', err.message);
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
};

const deleteTask = async (id) => {
    const sql = 'DELETE FROM items WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.run(sql, [id], function(err) {
            if (err) {
                console.error('Error deleting task:', err.message);
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
};

export {
    getAllTasks,
    addTask,
    updateTaskStatus,
    deleteTask
};
