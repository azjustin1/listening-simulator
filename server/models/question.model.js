const mongoose = require("mongoose");
const Choice = require("./choice.model");

const QuestionSchema = new mongoose.Schema({
  name: { type: String },
  content: { type: String },
  type: { type: Number, default: null },
  correctAnswer: { type: [Choice.ChoiceSchema] },
  answer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  subQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  choices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
