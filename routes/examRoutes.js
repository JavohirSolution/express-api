const router = require('express').Router();
const authMiddleware = require("../middleware/authMiddleware");
const Exam = require('../models/examModel');
const User = require('../models/users');
const Question = require('../models/questionModel');



//add exam 

router.post('/add', authMiddleware, async (req, res) => {
    try {
        //check if exam already exists
        const examExists = await Exam.findOne({ name: req.body.name })
        if (examExists) {
            return res.send({
                message: "Exam already exists",
                success: false
            })

        }
        const NewExam = new Exam({
            name: req.body.name,
            duration: req.body.duration,
            category: req.body.category,
            user_id: req.body.userId
        });
        await NewExam.save();
        res.status(200).send({
            message: "Exam created successfully",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: error
        });
    }

})

router.get("/getExams", authMiddleware, async (req, res) => {
    try {
        const exams = await Exam.find({})
        res.send({
            message: "Examslar olindi",
            data: exams,
            success: true
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        })
    }


})

router.post("/addQuestionToExam", authMiddleware, async (req, res) => {
    try {
        //add question to Questions collection
        const newQuestion = new Question(req.body);
        const question = await newQuestion.save();

        // add question to exam collection
        // const exam = await Exam.findById(req.body.exam);
        // exam.question.push(question._id);
        // await exam.save();
        res.send({
            message: "Question added successfully",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
})

router.delete("/deleteQuestion", authMiddleware, async (req, res) => {
    try {
        const questionExist = await Question.findById(req.body.questionId);
        if (!questionExist) {
            return res.send({
                message: "Bunday savol mavjud emass",
            })
        }
        const examExist = await Exam.findById(req.body.exam);
        if(!examExist){
            return res.send({
                message: "Bunday Id-ili Exam yo'q",
                success:false
            })
        }
        await Question.findByIdAndDelete(req.body.questionId);

        const exam = await Exam.findById(req.body.examId);
        exam.questions = exam.questions.filter((question) => {
            question._id != req.body.questionId
        })
        await exam.save();

        res.send({
            message: "Question deleted successfully",
            success: true
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        })
    }
})

module.exports = router;