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
        const sql = 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, taskName TEXT, description TEXT, status TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, dirty INTEGER DEFAULT 0, remoteId INTEGER, dueDate TEXT)';

        db.run(sql, (err)=> {
            if(err){
                console.error('Could not create table', err.message);
            }else{
                console.log('Table created or already exists');
            }
        });

        // Ensure the new columns exist for installations created before they were added.
        db.all("PRAGMA table_info(items)", [], (err, rows) => {
            if (err) {
                console.error('Could not inspect table', err.message);
                return;
            }
            const ensureColumn = (name, type) => {
                const exists = rows.some((row) => row.name === name);
                if (!exists) {
                    db.run(`ALTER TABLE items ADD COLUMN ${name} ${type}`, (alterErr) => {
                        if (alterErr) {
                            console.error(`Could not add ${name} column`, alterErr.message);
                        } else {
                            console.log(`${name} column added to items table`);
                        }
                    });
                }
            };
            ensureColumn('remoteId', 'INTEGER');
            ensureColumn('dueDate', 'TEXT');
        });

    }
});

export default db;
