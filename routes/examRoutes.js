const router = require('express').Router();
const authMiddleware = require("../middleware/authMiddleware");
const Exam = require('../models/examModel');
const User = require('../models/users');
const Question = require('../models/questionModel');

//add exam 
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { name, duration, category, userId } = req.body
        // Check if exam already exists
        const examExists = await Exam.findOne({ name: req.body.name });
        if (examExists) {
            return res.status(400).json({
                success: false,
                message: "Exam already exists"
            });
        }

        // Creating a new exam instance
        const newExam = new Exam({
            name: name,
            duration: duration,
            category: category,
            user_id: userId
        });

        // Saving the new exam
        await newExam.save();

        // Responding with success message
        res.status(200).json({
            success: true,
            message: "Exam created successfully"
        });
    } catch (error) {
        // Handling errors
        res.status(500).json({
            success: false,
            message: "Failed to create exam",
            error: error.message
        });
    }
});

router.get("/getExams", authMiddleware, async (req, res) => {
    try {
        const exams = await Exam.find({});
        res.status(200).json({
            success: true,
            message: "Exams retrieved successfully",
            data: exams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve exams",
            error: error.message
        });
    }
});

router.post("/addQuestionToExam", authMiddleware, async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        await newQuestion.save();

        res.status(200).json({
            success: true,
            message: "Question added successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add question",
            error: error.message
        });
    }
});

router.delete("/deleteQuestion", authMiddleware, async (req, res) => {
    try {
        const question = await Question.findById(req.body.questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        const exam = await Exam.findById(req.body.examId);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        await Question.findByIdAndDelete(req.body.questionId);

        exam.questions = exam.questions.filter((question) => question._id != req.body.questionId);
        await exam.save();

        res.status(200).json({
            success: true,
            message: "Question deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete question",
            error: error.message
        });
    }
});

module.exports = router;