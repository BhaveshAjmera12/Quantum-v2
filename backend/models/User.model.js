import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required:true,
    unique: true,
    trim :true,
    lowercase:true,
    minLength: [6, 'email must be 6 character long'],
    maxLength: [45, 'email no longer than 45 characters'],
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  resetOTP: {
  type: String,
  default: null,
},
otpExpires: {
  type: Date,
  default: null,
},

});

userSchema.statics.hashPassword = async function(password) {
   return await bcrypt.hash(password, 10)
}

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function(){
    return jwt.sign(
        {email: this.email} ,
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    )
}

const User = mongoose.model('User', userSchema);
export default User;