const express = require("express");
const SelfReading = require("../models/self-reading.model");
const { Question, SubQuestion } = require("../models/question.model");
const { isEmpty } = require("lodash");
const Choice = require("../models/choice.model");

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
  let { questionId, subQuestion } = req.body;
  try {
    let choices = [];
    if (!isEmpty(subQuestion.choices)) {
      choices = await Choice.insertMany(subQuestion.choices);
      subQuestion = { ...subQuestion, choices: choices };
    }
    const newSubQuestion = new SubQuestion(subQuestion);
    const savedSubQuestion = await newSubQuestion.save();
    const question = await Question.findById(questionId);
    question.subQuestions = [...question.subQuestions, savedSubQuestion];
    await question.save();
    res.status(201).send(savedSubQuestion);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/", async (req, res) => {
  const question = req.body;
  try {
    const updateQuestion = await Question.findByIdAndUpdate(question._id, question);

    if (!updateQuestion) {
      res.status(404).send("Not found");
    }

    res.status(200).send(updateQuestion);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/sub-questions", async (req, res) => {
  const question = req.body;
  try {
    const updateQuestion = await SubQuestion.findByIdAndUpdate(
      question._id,
      question,
    );

    if (!updateQuestion) {
      res.status(404).send("Not found");
    }

    if (!isEmpty(question.choices)) {
      question.choices.map(async (choice) => {
        await Choice.findByIdAndUpdate(choice._id, choice);
      });
    }

    res.status(200).send(updateQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).send("Not found");
    }
    await Question.findOneAndDelete({
      _id: questionId,
      subQuestions: question.subQuestions,
    });
    res.status(200).send({ questionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/sub-questions/:id", async (req, res) => {
  try {
    const questionId = req.params.id;
    await SubQuestion.findOneAndDelete({
      _id: questionId,
    });
    res.status(200).send({ questionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
