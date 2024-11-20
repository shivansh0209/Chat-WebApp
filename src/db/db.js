import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";

const connectDB= async () => {
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log('Try block of connectDB executed and hostname is:',connectionInstance.connection.host,'\n');

    }
    catch(err){
        console.log("Error catched in the catch block of the connectDB\n");
        throw err;
    }
    finally{
        console.log("Whole connectDB function is now executed\n")
    }
}

export default connectDB;