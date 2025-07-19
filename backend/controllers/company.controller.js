import * as companyService from '../services/company.service.js';
import companyModel from '../models/Company.model.js'
import logger from '../utils/logger.js';
import {sendMail} from '../services/sendmail.service.js';
import crypto from 'crypto';
import * as productService from '../services/product.service.js'

export const CompanyControllerVerifyEmail = async (req,res) =>{
  try {
      
      const {email} = req.body;
      const checkEmail = await companyModel.findOne({email});
      if (checkEmail  && checkEmail.isVerified === true) {
        logger.warn("email exist , you need to login")
        return res.status(409).json({ message: "Email already exists. Please login." });
      }
    
       const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expireOtp = Date.now() + 15 * 60 * 1000; 
    await companyService.submitEmail(email, otp, expireOtp)

    await sendMail(
  email,
  "Quantum – Company Registration Email Verification",
  `Dear Partner,

Thank you for choosing Quantum as your trusted platform to showcase and sell your products.

To complete your company registration, please verify your email address using the One-Time Password (OTP) below:

🔒 Your OTP: ${otp}

This verification step helps us ensure the security and authenticity of your company account.

If you did not initiate this registration, please disregard this message.

We look forward to a successful partnership.

Warm regards,  
Quantum Vendor Support Team  
Laptop E-commerce Platform`
);

    return res.status(200).json({message: "otp sent successfully", otp})



  } catch (error) {
    logger.error("Error in verifyEmail:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const companyControllerCheckOtp = async (req,res) =>{
    try {
        const {email, otp} = req.body;
    const company = await companyModel.findOne({email})

    if (!company) {
        logger.warn("no company found , type right email")
        return res.status(400).json({message: "type right email"});
        
    }

    if (company.resetOTP !== otp || Date.now() > company.otpExpiry) {
      await company.deleteOne()


        logger.warn("otp is incoorrect or may be your session has expired. go back and register again and write email again")
        return res.status(400).json({message: "invalid or expoiry otp, go back again "});
    }
    
    company.resetOTP = null;
    company.otpExpiry = null;
    company.isVerified = true
    await company.save();

    return res.status(200).json({message: "email verifiaction successfull"});
    } catch (error) {
    logger.error("Error in checkOtp:", error);
    return res.status(500).json({ message: "Internal Server Error" });
    }
  
}

export const createCompanyController = async (req,res) =>{
    try {
      const {email} = req.body;
    const company = await companyModel.findOne({email})
    
    if (!company || company.isVerified !== true) {
      logger.warn("Email not verified via OTP", error);
      return res.status(400).json({ message: "Please verify your email first" });
    }


    await companyService.createCompanyService(req.body)

    const token = company.generateToken()
    res.cookie('token', token);

    await sendMail(
  email,
  "Quantum – Company Registration Successful",
  `Dear Partner,

We’re pleased to inform you that your company registration on Quantum has been successfully completed.

You can now access your seller dashboard, manage your product listings, and prepare to launch your offerings on our platform.

🚧 *Please Note:* Quantum is currently under development. This email has been sent for testing purposes only as part of an internal project.

If you have any questions or feedback, feel free to reach out.

Best regards,  
Bhavesh Ajmera  
Developer, Quantum (Laptop E-commerce Platform)`
);


    
    return res.status(201).json({ message: "Company registered successfully", token, company });

    } catch (error) {  
      logger.error("internal server error", error)
    return res.status(401).json({ message: "internal server error" });
    }


}

export const Login = async (req,res)=>{
   try {
    const { email, password } = req.body;

    // Check if company exists
    const company = await companyModel.findOne({ email }).select('+password') ;
    if (!company) {
      logger.warn(`Login failed: No company found with email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords (hashed)
    const isMatch = await company.comparePassword(password)
    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = company.generateToken();
    res.cookie("token", token);

    logger.info(`Company logged in: ${email}`);
    res.status(200).json({
      message: 'Login successful',
      token,
      company
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
}

export const companyCreateProduct = async(req, res) =>{
  try {


    const company = await companyModel.findOne({ email: req.user.email });

    const newProduct = await productService.CreateProduct(req.body, company._id)
   res.status(200).json({message: "product created successfully", newProduct });
    
  } catch (error) {
    logger.error("internal server errror", error)
    res.status(401).json({message: "server error", error})
    
  }
}





// console.log("Raw price from req.body:", req.body.price);

    // if (!req.body.price) {
    //   return res.status(400).json({ message: "Price is required" });
    // }

    //  const price = Number(req.body.price);

    // if (isNaN(price)) {
    //   return res.status(400).json({ message: "Price must be a valid number" });
    // }

    // req.body.price = price;