import mongoose from 'mongoose';

const connectToDB = async () => {
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017/logitruck');
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(err){
        console.log(`Error in connecting to MongoDB: ${err}`);
        process.exit(1);
    }
}

export default connectToDB;