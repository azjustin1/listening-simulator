const mongoose = require("mongoose");
const Question = require("./question.model");

// Define the SelfReadingModel schema
const SelfReadingSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  content: { type: String },
  timeout: { type: Number, required: false },
  questions: [Question.schema],
  wordCount: { type: Number },
  testDate: { type: Date },
});

const SelfReading = mongoose.model("SelfReading", SelfReadingSchema);

module.exports = SelfReading;
