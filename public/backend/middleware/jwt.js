import jwt from 'jsonwebtoken';
import config from '../config/config.js';

function signToken({ id, username, email }) {
  return jwt.sign(
    {
      sub: id,
      username,
      email,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn || '7d' },
  );
}

export default { signToken };
