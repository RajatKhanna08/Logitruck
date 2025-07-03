// Import the mongoose library for MongoDB interaction
import mongoose from 'mongoose';

// Asynchronous function to connect to the MongoDB database
const connectToDB = async () => {
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017/logitruck');
        // Log a success message with the connected host if the connection is successful
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    }
    catch (err) {
        // Log an error message if the connection fails
        console.log(`❌ Error in connecting to MongoDB: ${err}`);
        // Exit the process with a failure code to prevent the app from running without a DB connection
        process.exit(1);
    }
}

export default connectToDB;