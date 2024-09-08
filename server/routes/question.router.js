const express = require("express");
const SelfReading = require("../models/self-reading.model");
const Question = require("../models/question.model");
const { isEmpty, each } = require("lodash");
const { Choice } = require("../models/choice.model");

const router = express.Router();

router.post("/", async (req, res) => {
  const { quizId, question } = req.body;
  try {
    const newQuestion = new Question(question);
    const savedQuestion = await newQuestion.save();
    const quiz = await SelfReading.findById(quizId);
    quiz.questions = [...quiz.questions, savedQuestion];
    await quiz.save();
    res.status(201).send(savedQuestion);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/sub-questions", async (req, res) => {
  const { questionId, subQuestion } = req.body;
  try {
    const newQuestion = new Question(subQuestion);
    const savedSubQuestion = await newQuestion.save();
    const question = await Question.findById(questionId);
    question.subQuestions = [...question.subQuestions, savedSubQuestion];
    await question.save();
    res.status(201).send(savedSubQuestion);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.patch("/", async (req, res) => {
  const question = req.body;
  console.log(question)
  try {
    const updateQuestion = await Question.updateOne(
      { _id: question._id },
      question,
    );

    if (!updateQuestion) {
      res.status(404).send("Not found");
    }

    if (!isEmpty(updateQuestion.choices)) {
      const choiceUpdates = updateQuestion.choices.map(async (choice) => {
        return Choice.updateOne({ _id: choice._id, choice });
      });
      console.log(choiceUpdates)
      await Promise.all(choiceUpdates);
    }

    res.status(200).send(updateQuestion);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
