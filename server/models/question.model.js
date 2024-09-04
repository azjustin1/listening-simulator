const mongoose = require("mongoose");

const SubQuestionSchema = new mongoose.Schema({
  name: { type: String },
  content: { type: String },
  type: { type: Number, default: null },
  answer: { type: [String] }, // Can be an array of strings or a single string
  correctAnswer: { type: [String] }, // Array of strings
});

const QuestionSchema = new mongoose.Schema({
  name: { type: String },
  content: { type: String },
  type: { type: Number, default: null },
  subQuestions: { type: [SubQuestionSchema] },
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
