const router = require('express').Router();
const authMiddleware = require("../middleware/authMiddleware");

const { createExam, getExam, addQuestionToExam, deleteQuestion } = require('../controllers/examController');

router.post('/add', authMiddleware, createExam);

router.get("/getExams", authMiddleware, getExam);

router.post("/addQuestionToExam", authMiddleware, addQuestionToExam);

router.delete("/deleteQuestion", authMiddleware, deleteQuestion);

module.exports = router;