const mongoose = require("mongoose");

// Define the SelfReadingModel schema
const SelfReadingSchema = new mongoose.Schema({
  name: { type: String },
  content: { type: String },
  timeout: { type: Number, required: false },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  wordCount: { type: Number },
  testDate: { type: Date },
});

const SelfReading = mongoose.model("SelfReading", SelfReadingSchema);

module.exports = SelfReading;
