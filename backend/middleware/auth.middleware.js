import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'

export const authUser = async (req,res,next)=>{
 
    try {
        const token = req.cookies?.token || req.headers.authorization.split(' ')[1];
        if(!token){
            logger.warn("Unauthorized access attempt - no token provided ")
            res.status(401).json({message: "unauthorized user"});

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        console.log(req.user);
        next();

    } catch (error) {
       logger.error(`Auth middleware error: ${error.message}`, {stack: "error.stack"})
        return res.status(401).json({ message: "Invalid or expired token" });
    }

}