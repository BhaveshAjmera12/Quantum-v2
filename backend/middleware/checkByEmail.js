import userModel from "../models/User.model.js";

export const checkUserByEmail = async (req,res,next)=>{
  try {
     const {email} = req.body;
     const user = await userModel.findOne({email}).select('+password')

   if(!user){
    return res.status(400).json({error: "invlaid email"});
   }

   req.user = user

   next();
  } catch (error) {
    return res.status(500).json({error: "internal server error"});
  }
}