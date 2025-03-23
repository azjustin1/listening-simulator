const express = require("express");
const Part = require("../models/Part");
const Question = require("../models/Question");
const Choice = require("../models/Choice");
const router = express.Router();
const findQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      res.status(404).json({ message: "Question not found." });
    }
    return question;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
router.get("/:id", async (req, res) => {
  const question = findQuestion(req, res);
  res.status(200).json(question);
});
router.post("/", async (req, res) => {
  try {
    const { description, type, choices, partId } = req.body;
    let newChoices = [];
    const newQuestion = new Question({
      description: description,
      type: type,
      partId: partId,
      choices: [],
    });
    await newQuestion.save();
    let savedChoices;
    if (choices.length > 0) {
      for (const choice of choices) {
        const newChoice = new Choice({
          content: choice.content,
          questionId: newQuestion._id,
        });
        newChoices.push(newChoice);
      }
      savedChoices = await Choice.insertMany(newChoices);
      newQuestion.choices = savedChoices.map((choice) => choice._id);
      await newQuestion.save();
    }
    const response = await Question.populate(newQuestion, { path: "choices" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/:questionId", async (req, res) => {
  try {
    const updateQuestionData = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.questionId,
      updateQuestionData,
    ).exec();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  const existedQuestion = await Question.findById(questionId);
  if (!existedQuestion) {
    return res.status(404).send(false);
  }
  await Part.findByIdAndUpdate(existedQuestion.partId, {
    $pull: { questions: questionId },
  }).exec();
  await Choice.deleteMany({ questionId: questionId }).exec();
  await existedQuestion.deleteOne();
  res.status(200).send(true);
});
module.exports = router;
