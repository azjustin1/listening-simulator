const mongoose = require("mongoose");

// Define the Choice interface
const ChoiceSchema = new mongoose.Schema({
  id: { type: String },
  content: { type: String },
  index: { type: String },
  order: { type: Number },
  answer: { type: String },
  correactAnswer: { type: String },
});

const Choice = mongoose.model("Choice", ChoiceSchema);

module.exports = { ChoiceSchema, Choice };
