import * as ordercontroller from '../controllers/order.controller.js'
import * as finalOrderController from '../controllers/FinalOrder.controller.js';
import {Router} from 'express'
import {authUser} from '../middleware/auth.middleware.js' 
import { body } from 'express-validator';

const router = Router();

const createOrderValidation = [
  body('products').isArray({ min: 1 }).withMessage('At least one product required'),
  body('products.*.name').notEmpty(),
  body('products.*.price').isFloat({ gt: 0 }),
  body('products.*.quantity').isInt({ gt: 0 })
];

const finalizeOrderValidation = [
  body('orderId').notEmpty().withMessage('Order ID is required'),

  body('shippingAddress.addressLine').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty(),
  body('shippingAddress.state').notEmpty(),
  body('shippingAddress.pincode').notEmpty(),
  body('shippingAddress.country').notEmpty(),

  body('paymentMethod')
    .isIn(['Cash on Delivery', 'Online Payment'])
    .withMessage('Payment method must be valid'),
];

router.post('/', authUser,createOrderValidation, ordercontroller.createOrderController)
router.post('/checkout', authUser,createOrderValidation, finalOrderController.handleOrderCheckout)
router.put(
  '/ordersubmision',
  authUser,
  finalizeOrderValidation,
  finalOrderController.finalizeOrderController
);

router.get('/test', (req, res) => {
  res.send('✅ Order route working');
});





export default router;