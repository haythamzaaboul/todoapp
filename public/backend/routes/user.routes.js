import {Router} from 'express';
import userController from "./user.routes.js";



const router = Router();

router.get('/', Auth, userController.getUserProfile);


router.post('/', UserValidation, userController.createUser);


export default router;
