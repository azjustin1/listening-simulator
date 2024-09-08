const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
  comment: { type: String },
  rating: { type: Number, min: 1, max: 5 },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
