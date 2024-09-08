const mongoose = require("mongoose");
const Question = require("../models/question.model");

const readingPartSchema = new mongoose.Schema({
  id: String,
  content: String,
  questions: [Question.schema],
  imageName: String,
  timeout: Number,
});

const Reading = mongoose.model("Reading", readingPartSchema);
module.exports = Reading;
