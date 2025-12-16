import bcrypt from "bcrypt";
import sign from '../middleware/jwt.js';

const SALT_ROUNDS = 12;
async function getUser(Username, db){
    const q = 'SELECT id, username, email, created_at FROM users WHERE username = $1 '
    const {rows} = await db.query(q, [Username]);
    return rows[0];
}


async function addUser(username, email, password, db) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const q = 'INSERT INTO users (username, email, password_hashed) VALUES ($1, $2, $3) RETURNING id, username, email, created_at';
  const {rows} = await db.query(q, [username, email, hashedPassword]);
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


async function loginUser(username, password, db) {
  const q = 'SELECT * FROM users WHERE username = $1';
  const { rows } = await db.query(q, [username]);
  const user = rows[0];

  if (user && bcrypt.compareSync(password, user.password_hashed)) {
    const token = sign.signToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    return { token };
  }
  return null;
}
export default {getUser, addUser, deleteUser,loginUser};
