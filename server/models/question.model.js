const mongoose = require("mongoose");

const subQuestionSchema = new mongoose.Schema({
  content: String,
  type: Number,
  choices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  answer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  correctAnswer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  subQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

const SubQuestion = mongoose.model("SubQuestion", subQuestionSchema);

const questionSchema = new mongoose.Schema({
  content: String,
  type: Number,
  choices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  answer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  correctAnswer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  subQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubQuestion" }],
});

const Question = mongoose.model("Question", questionSchema);
module.exports = { SubQuestion, Question };
