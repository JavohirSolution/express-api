const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('[database]: Database connected successfully');
    } catch (error) {
        console.error('[database]: Error connecting to database:', error.message);
        process.exit(1); // Exit the process if unable to connect to the database
    }
}

module.exports = connectDB;