const mongoose = require("mongoose");
const { Question, SubQuestion } = require("./question.model");

const choiceSchema = new mongoose.Schema({
  content: String,
  index: String,
  answer: String,
  correctAnswer: String,
  order: Number,
});

choiceSchema.pre("findOneAndDelete", async function (next) {
  try {
    const choiceId = this.getFilter()["_id"];

    // Delete all reference choices in question
    await mongoose.model("Question").updateOne(
      {
        choices: choiceId,
      },
      {
        $pullAll: {
          choices: [{ _id: choiceId }],
        },
      },
    );

    // Delete all reference choices in sub-question
    await mongoose.model("SubQuestion").updateOne(
      {
        choices: choiceId,
      },
      {
        $pullAll: {
          choices: [{ _id: choiceId }],
        },
      },
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Choice = mongoose.model("Choice", choiceSchema);
module.exports = Choice;
