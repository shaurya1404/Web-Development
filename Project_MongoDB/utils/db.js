import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = function() {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connected to mongoDB")
    })
    .catch((err) => {
        console.log("error in connecting to mongoDB", err)
    })
}

export default db