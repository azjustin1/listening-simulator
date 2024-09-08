const express = require("express");
const SelfReading = require("../models/self-reading.model");
const Question = require("../models/question.model");
const { Choice } = require("../models/choice.model");

const router = express.Router();

router.post("/", async (req, res) => {
  const { questionId, choice } = req.body;

  try {
    const newChoice = new Choice(choice);
    const savedChoice = await newChoice.save();

    await Question.updateOne(
      { _id: questionId },
      { choices: [savedChoice] },
    );
    res.status(201).send(savedChoice);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/", async (req, res) => {
  const choice = req.body;
  try {
    const updateChoice = await Choice.updateOne({
      _id: choice._id,
      choice,
    });

    if (!updateChoice) {
      res.status(404).send("Not found");
    }

    res.status(200).send(updateChoice);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
