import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors';
import db from './db/db.js'
import productroute from './routes/product.route.js';
import userroute from './routes/user.route.js';
import companyroute from './routes/company.route.js'
import cartroute from './routes/cart.route.js'
import orderroute from './routes/order.route.js'
import razorpayRoutes from "./routes/razorpay.route.js";
import cookieParser from 'cookie-parser';

db();

const app = express();
app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/product', productroute);
app.use('/users', userroute);
app.use('/company', companyroute);
app.use('/cart', cartroute)
app.use('/order', orderroute)
app.use("/payment", razorpayRoutes);

app.get('/', (req, res) => {
    res.send("hello ji");
});

export default app


