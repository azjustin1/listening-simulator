const mongoose = require("mongoose");
const { flatMap } = require("lodash");

const subQuestionSchema = new mongoose.Schema({
  content: String,
  type: Number,
  name: String,
  choices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  answer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  correctAnswer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  subQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

subQuestionSchema.pre("findOneAndDelete", async function (next) {
  try {
    const questionId = this.getFilter()["_id"];
    const subQuestion = await SubQuestion.findById(questionId).select("choices");
    // Delete all choices
    await mongoose.model("Choice").deleteMany({
      _id: { $in: subQuestion.choices },
    });

    // Delete sub-question in question
    await Question.updateOne(
      {
        subQuestions: questionId,
      },
      {
        $pullAll: {
          subQuestions: [{ _id: questionId }],
        },
      },
    );
    next();
  } catch (error) {
    next(error);
  }
});

subQuestionSchema.pre("deleteMany", async function (next) {
  try {
    const allSubQuestions = await SubQuestion.find(this.getFilter()).select({
      choices: 1,
    });
    const allChoices = flatMap(
      allSubQuestions.map((subQuestion) => subQuestion.choices),
    );

    await mongoose.model("Choice").deleteMany({
      _id: { $in: allChoices },
    });
    next();
  } catch (error) {
    next(error);
  }
});

const SubQuestion = mongoose.model("SubQuestion", subQuestionSchema);

const questionSchema = new mongoose.Schema({
  content: String,
  type: Number,
  name: String,
  choices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  answer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  correctAnswer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Choice" }],
  subQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubQuestion" }],
});

questionSchema.pre("findOneAndDelete", async function (next) {
  try {
    const subQuestions = this.getFilter()["subQuestions"];
    // Delete all sub-questions
    await mongoose.model("SubQuestion").deleteMany({
      _id: { $in: subQuestions },
    });

    next();
  } catch (error) {
    next(error);
  }
});

const Question = mongoose.model("Question", questionSchema);
module.exports = { SubQuestion, Question };
