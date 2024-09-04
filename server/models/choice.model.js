const mongoose = require("mongoose");

// Define the Choice interface
const ChoiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  index: { type: String, required: false },
  answer: { type: String, required: false },
  correctAnswer: { type: String, required: false },
});

const Choice = mongoose.model("Choice", ChoiceSchema);

module.exports = Choice;
