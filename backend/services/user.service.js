import userModel from '../models/User.model.js'

export const createUser = async ({name, email, password})=>{
    if (!name || !email || !password) {
        throw new Error('email, name and password will be required');
    }

     const existingUser = await userModel.findOne({email})
        if(existingUser){
            throw new Error("Email already exists");
        }

    const hashedPassword = await userModel.hashPassword(password)
    const User = await userModel.create({
        name,
        email,
        password: hashedPassword
    })  

    return User
}