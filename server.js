const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json())
require('dotenv').config();
const db = require('./config/db.js');

const UserRoute = require("./routes/userRoutes.js");
const ExamRote = require("./routes/examRoutes.js");
// const AuthExams = require('./routes/userExamsRoute');
const userModel = require('./models/users.js');

app.use("/api/users", UserRoute);
app.use("/api/exams", ExamRote);
// app.use("/api/", AuthExams);

db()
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})