import sqlite3 from 'sqlite3';

const dbName = 'local_database.sqlite';


let db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error('Could not connect to database', err.message);
        throw err;
    } else {
        console.log('Connected to database');
        // 0 task is notsynced, 1 task is synced
        // status can be 'pending', 'completed', 'deleted'        
        const sql = 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, taskName TEXT, description TEXT, status TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, dirty INTEGER DEFAULT 0)';

        db.run(sql, (err)=> {
            if(err){
                console.error('Could not create table', err.message);
            }else{
                console.log('Table created or already exists');
            }
        })

    }
});

export default db;