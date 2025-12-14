import jwt from 'jsonwebtoken';
import config from '../config/config.js';

function signToken({ id, username, email }) {
  return jwt.sign(
    {
      sub: id,
      username,
      email,
    },
    config.jwtSecret,
    { expiresIn: '7d' },
  );
}

export default { signToken };
