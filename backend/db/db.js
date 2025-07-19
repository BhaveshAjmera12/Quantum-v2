import mongoose from 'mongoose'

const db = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        ssl: true, // same as tls:true
    })
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error("Error connecting to DB:", err.message);
    });
};

export default db;
