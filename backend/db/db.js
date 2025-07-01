import mongoose from 'mongoose'

const db =  ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("connected to db")
    }).catch((err) => {
       console.error("something went wrong not connect to database") 
    });
}


export default db