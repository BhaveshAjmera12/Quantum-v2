import {Router} from 'express'
import * as userController from '../controllers/user.controller.js'
import {body} from 'express-validator'
import {checkUserByEmail} from '../middleware/checkByEmail.js'
import {authUser} from '../middleware/auth.middleware.js' 

const router = Router();

router.post('/register',
    body('name').notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('email must be valid'),
    body('password').isLength({min: 6}).withMessage("password must be at least have 6 charachter"),
    userController.createUserController);

router.post('/login',
    body('email').isEmail().withMessage('email must be valid'),
    body('password').isLength({min: 6}).withMessage("password must be at least have 6 charachter"),
    userController.Login);

router.post('/forgot-password-request',checkUserByEmail, userController.ForgotPasswordRequest );

router.post('/verifyOtp',checkUserByEmail, userController.verifyOtp);

router.post('/resetPassword', checkUserByEmail, userController.resetPassword);

router.get('/profile', authUser, userController.Profile )

export default router