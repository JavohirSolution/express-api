const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    user_id: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        required: true,
    }

}, {
    timestamps: true,
})

const Exam = mongoose.model('exams', examSchema);
module.exports = Exam;
