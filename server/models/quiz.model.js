const mongoose = require("mongoose");
const Listening = require("../models/listening.model");
const Reading = require("../models/reading.model");
const Writing = require("../models/writing.model");

const quizSchema = new mongoose.Schema({
  id: String,
  name: String,
  timeout: Number,
  listeningParts: [Listening.schema],
  readingParts: [Reading.schema],
  writingParts: [Writing.schema],
  listeningTimeout: Number,
  readingTimeout: Number,
  writingTimeout: Number,
  audioUrl: String,
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
