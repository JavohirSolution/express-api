const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
app.use(express.json());

dotenv.config();

const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const examRoutes = require("./routes/examRoutes");

connectDB(process.env.MONGO_URL);

app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`[server]: Server is running on http://localhost:${PORT}`);
});