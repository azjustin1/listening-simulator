const mongoose = require("mongoose");
const Feedback = require("./feedback.model");
const Quiz = require("./quiz.model");
const Listening = require("./listening.model");
const Reading = require("./reading.model");
const Writing = require("./writing.model");

const resultSchema = new mongoose.Schema({
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
  studentName: { type: String },
  correctListeningPoint: { type: Number },
  totalListeningPoint: { type: Number },
  correctReadingPoint: { type: Number },
  totalReadingPoint: { type: Number },
  testDate: { type: String },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  isSubmit: { type: Boolean },
  currentTab: { type: Number },
  audioTime: { type: Number },
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
