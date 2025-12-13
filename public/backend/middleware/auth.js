import jwt  from 'jsonwebtoken';
import config from '../config/config.js'; 
import User from '../modal/user.modal.js'; 

export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
  } catch (err){
    
  }
}
