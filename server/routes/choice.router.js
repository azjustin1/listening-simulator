const express = require("express");
const { Question, SubQuestion } = require("../models/question.model");
const Choice = require("../models/choice.model");

const router = express.Router();

router.post("/", async (req, res) => {
  const { question, choice } = req.body;

  try {
    const newChoice = new Choice(choice);
    const savedChoice = await newChoice.save();

    const existedQuestion = await Question.findById(question._id);
    if (existedQuestion) {
      await Question.updateOne(
        { _id: existedQuestion._id },
        { choices: [savedChoice] },
      );
    } else {
      await SubQuestion.updateOne(
        { _id: question._id },
        { choices: [savedChoice] },
      );
    }

    res.status(201).send(savedChoice);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.patch("/", async (req, res) => {
  const choice = req.body;
  try {
    const updateChoice = await Choice.findOneAndUpdate(
      {
        _id: choice._id,
      },
      choice,
    );

    if (!updateChoice) {
      res.status(404).send("Not found");
    }

    res.status(200).send(updateChoice);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const choiceId = req.params.id;
    await Choice.findOneAndDelete({
      _id: choiceId,
    });
    res.status(200).send({ questionId: choiceId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
