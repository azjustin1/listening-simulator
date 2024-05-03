const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  content: String,
  type: Number,
  choices: [
    {
      id: String,
      content: String,
      index: String,
      correctAnswer: String,
    },
  ],
  answer: String,
  correctAnswer: String,
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
