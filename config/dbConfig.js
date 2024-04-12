const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Mongo DB Connection successfully');
});

connection.on('error', err => {
    console.log('Mongo DB Connection Failed');
});

module.exports = connection;