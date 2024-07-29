const mongoose = require("mongoose");
const Choice = require("./choice.model");

const questionSchema = new mongoose.Schema({
  content: String,
  type: Number,
  choices: [Choice.schema],
  answer: String,
  correctAnswer: String,
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
