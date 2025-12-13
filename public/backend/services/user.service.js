import bcrypt from "bcrypt";


const SALT_ROUNDS = 12;
async function getUser(Username, db){
    const q = 'SELECT id, username, email, created_at FROM users WHERE username = $1 '
    const {rows} = await db.query(q, [Username]);
    return rows[0];
}


async function addUser(username, email, password, db) {
  const hashedpassword = await bcrypt.hash(password, SALT_ROUNDS);
  const q = 'INSERT INTO users (username, email, hashedpassword) RETURNING id, username, email, created_at';
  const {rows} = db.query(q, [username, email, hashedpassword]);
  return rows[0];
}


async function deleteUser(username, db) {
  const q = `
    DELETE FROM users
    WHERE username = $1
    RETURNING id, username, email
  `;

  const { rows } = await db.query(q, [username]);
  return rows[0] || null;
}

export default {getUser, addUser, deleteUser,};
