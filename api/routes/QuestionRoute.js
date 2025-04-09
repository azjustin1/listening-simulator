const express = require("express");
const Part = require("../models/Part");
const Question = require("../models/Question");
const Choice = require("../models/Choice");
const router = express.Router();
const findQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    console.log(question);
    if (!question) {
      res.status(404).json({ message: "Question not found." });
    } else {
      res.status(200).json(question);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
router.get("/:questionId", async (req, res) => {
  await findQuestion(req, res);
});
router.post("/", async (req, res) => {
  try {
    const { description, type, choices, partId } = req.body;
    console.log(req.body);
    const newQuestion = new Question({
      description: JSON.stringify(description),
      type: type,
      partId: partId,
    });
    await newQuestion.save();
    if (choices.length > 0) {
      await saveQuestionChoice(newQuestion, choices);
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
    const choices = updateQuestionData.choices;
    updateQuestionData.choices = [];
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.questionId,
      { description: updateQuestionData.description },
    ).exec();
    if (choices.length > 0) {
      await Choice.deleteMany({ questionId: updatedQuestion._id });
      res.status(200).json(await saveQuestionChoice(updatedQuestion, choices));
    } else {
      res.status(200).json(updatedQuestion);
    }
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
const saveQuestionChoice = async (newQuestion, choices) => {
  let savedChoices;
  let newChoices = [];
  for (const choice of choices) {
    const newChoice = new Choice({
      content: choice.content,
      questionId: newQuestion._id,
      isCorrect: choice.isCorrect,
    });
    newChoices.push(newChoice);
  }
  savedChoices = await Choice.insertMany(newChoices);
  newQuestion.choices = savedChoices.map((choice) => choice._id);
  const savedQuestionWithChoices = await newQuestion.save();
  return await Question.populate(savedQuestionWithChoices, { path: "choices" });
};
module.exports = router;
