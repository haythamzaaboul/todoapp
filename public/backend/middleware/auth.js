import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// verify JWT token middleware
export default function Auth(req, res, next) {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'Please authenticate.' });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    req.user = {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
    };
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
}
