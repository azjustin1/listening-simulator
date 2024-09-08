const mongoose = require("mongoose");

const choiceSchema = new mongoose.Schema({
  id: String,
  content: String,
  index: String,
  correctAnswer: String,
  answer: String,
  order: Number
});
const Choice = mongoose.model("Choice", choiceSchema);
module.exports = Choice;
