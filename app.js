const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
app.use(express.json());

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const userRoutes = require("./routes/userRoutes");
const examRoutes = require("./routes/examRoutes");

app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);

module.exports = app