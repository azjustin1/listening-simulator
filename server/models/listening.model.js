const mongoose = require("mongoose");
const Question = require("../models/question.model");

const listeningPartSchema = new mongoose.Schema({
  id: String,
  name: String,
  content: String,
  audioName: String,
  questions: [Question.schema],
  timeout: Number,
});

const Listening = mongoose.model("Listening", listeningPartSchema);
module.exports = Listening;
