import { addUserSchema, loginUserSchema } from '../helpers/validators/user.schema.js';

export default function UserValidation(req, res, next) {
  try {
    if (req.path === '/auth') {
      loginUserSchema.parse(req.body);
    } else {
      addUserSchema.parse(req.body);
    }
    return next();
  } catch (err) {
    const message = err?.errors ? err.errors.map((e) => e.message).join(', ') : err.message;
    return res.status(400).json({
      status: 'fail',
      message: message || 'Invalid request payload',
    });
  }
}
