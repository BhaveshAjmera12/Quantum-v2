import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      // required: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
      match: [
    /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,  // This is the regex for CIN format
    'Invalid CIN format. Must be 21-character standard format.'  // Custom error message
  ]
},
     
   password: {
    type:String,
    // required:true,
    select:false,
   minLength: [6, 'password must be 6 character long']
   },

    registrationDate: {
      type: Date,
      default: Date.now()
      // required: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String, default: 'India' },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      minLength: [6, 'email must be 6 character long'],
      maxLength: [45, 'email no longer than 45 characters'],
    },
    phone: {
      type: String,
      // required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },

    // OTP Fields
    resetOTP: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },

    isVerified: {
   type: Boolean,
   default: false
},
    registrationComplete:{
      type: Boolean,
      default: false
    }
  });

companySchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password,10)
    
}

companySchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

companySchema.methods.generateToken = function(){
    return jwt.sign(
        {email: this.email} ,
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    )
}

const Company = mongoose.model('Company', companySchema);

export default Company;
