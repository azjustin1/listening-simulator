const mongoose = require("mongoose");

const choiceSchema = new mongoose.Schema({
  content: String,
  index: String,
  order: Number
});
const Choice = mongoose.model("Choice", choiceSchema);
module.exports = Choice;
