import {Router} from 'express';

const router = Router();

router.get('/', Auth, userController.getUserProfile);

router.post('/', UserValidation, userController.createUser);


export default router;