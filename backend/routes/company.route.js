import * as companyController from '../controllers/company.controller.js'
import {Router} from 'express'
import {authUser} from '../middleware/auth.middleware.js' 
import {uploadProductImages, handleProductImageUpload} from '../middleware/uploadImage.middleware.js'


const router = Router();

router.post('/sendOtp', companyController.CompanyControllerVerifyEmail);

router.post('/checkOtp', companyController.companyControllerCheckOtp);

router.post('/finalregistration', companyController.createCompanyController);

router.post('/login', companyController.Login);

router.post('/createProduct',authUser,uploadProductImages,handleProductImageUpload, companyController.companyCreateProduct);

export default router;


