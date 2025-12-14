import {Router} from 'express';
import {getUserProfile, addUser, deleteUser, loginUser} from '../controller/unserController.js';
import Auth from '../middleware/auth.js';
import UserValidation from '../middleware/userValidation.js';


const router = Router();

router.get('/', Auth, getUserProfile);


router.post('/', UserValidation, addUser);

router.delete('/id',Auth, deleteUser);

router.post('/auth', UserValidation, loginUser);




export default router;
