import {Router} from 'express'
import * as productController from '../controllers/product.controller.js';

const router = Router();

router.post('/', productController.CreateProductController);

router.get('/', productController.GetAllProducts);

export default router;