const mongoose = require("mongoose");

const writingPartSchema = new mongoose.Schema({
  id: String,
  content: String,
  questions: [
    {
      content: String,
      type: Number,
      choices: [
        {
          id: String,
          content: String,
        },
      ],
      answer: String,
      correctAnswer: String,
    },
  ],
  imageName: String,
  answer: String,
  timeout: Number,
});

const Writing = mongoose.model("Writing", writingPartSchema);
module.exports = Writing;
