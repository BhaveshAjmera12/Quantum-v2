import userModel from '../models/User.model.js';
import * as userService from '../services/user.service.js';
import {validationResult} from 'express-validator';
import {sendMail} from "../services/sendmail.service.js";
import crypto from "crypto";
import logger from '../utils/logger.js'

export const createUserController = async (req,res) =>{
    
const errors = validationResult(req)

if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() })
}

try {
    const {email} = req.body;

    const user = await userService.createUser(req.body)
    const token = await user.generateToken();
    await sendMail(email, "rebuilt_Quantum { laptop e-commerce website } , hello welcome to quantum website.", `welcome ${user.name}, exlore the website `) 

    res.cookie("token", token, {
    httpOnly: true, // prevents JS access (secure)
    secure: false, // only over HTTPS in production
    sameSite: 'Lax', // or 'Strict' to control cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

    return res.status(200).json({token, user})
} catch (error) {
    return res.status(500).json({ message: error.message || "Internal Server Error" });
}
}

export const Login = async(req,res) =>{

    const errors = validationResult(req)

if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() })
}
    try {
    const {name, email, password} = req.body
    const user = await userModel.findOne({email}).select('+password')

    if(!user){
        return res.status(400).json({error: "password or email is not match"});
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
    return res.status(400).json({error: "password or email is not match"});
    }

    const token = await user.generateToken();
     res.cookie("token", token, {
    httpOnly: true, // prevents JS access (secure)
    secure: false, // only over HTTPS in production
    sameSite: 'Lax', // or 'Strict' to control cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
    return res.status(200).json({token, user});
        
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

export const Profile = async(req,res) =>{
    try {
       const email = req.user.email;
       const user = await userModel.findOne({email}).select('-password')
       
        res.status(200).json(user);
       
    } catch (error) {
        logger.error('something went wrong')
        res.status(400).json({error: error.message})
    }
}

export const ForgotPasswordRequest = async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
      const {email} = req.body
      const user = req.user;

      console.log("User from middleware:", user);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.resetOTP = otp;
      user.otpExpires = Date.now() + 15 * 60 * 1000;   // 15 min
      await user.save();

       console.log("User saved with OTP:", user);

      await sendMail(email, "rebuilt_Quantum { laptop e-commerce website } , hello welcome to quantum services , you want otp to reset your password. ", `your OPT is ${otp}`)

      
     res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error(error); 
        return res.status(500).json({error: "internal server issue"})
    }
}


export const verifyOtp = async (req,res)=>{
    try {
        const {email, otp}= req.body
        const user = req.user

        if (user.resetOTP !== otp || Date.now > user.otpExpires) {
            return res.status(400).json({error: "Invalid or expired OTP"});
        }

        user.resetOTP = null;
        user.otpExpires = null;
        await user.save();

        return res.status(200).json({ message: "OTP verified" });

    } catch (error) {
         return res.status(500).json({ error: "Server error" });
    }
}

export const resetPassword = async (req,res)=>{
  try {
      const {email, password} = req.body;
      const user = req.user;

      user.password = await user.hashPassword(password)
      await user.save();
      return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(200).json({ error: error.message });
  }

}