const express = require("express");
const router = express.Router();
const ChoiceService = require("../services/ChoiceService");
const Question = require("../models/Question");
const Choice = require("../models/Choice");
router.post("/", async (req, res) => {
  try {
    const choiceData = req.body;
    const choice = new Choice(choiceData);
    await choice.save();
    const question = await Question.findById(choiceData.questionId);
    if (!question) {
      res.status(404).json({
        message: "Question not found with ID: " + choiceData.questionId,
      });
    }
    question.choices.push(choice._id);
    await question.save();
    return res.status(201).json(choice);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const choice = await ChoiceService.show(req.params.id);
    if (!choice) {
      return res.status(404).json({ message: "Choice not found" });
    }
    return res.json(choice);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const choice = await ChoiceService.update(req.params.id, req.body);
    if (!choice) {
      return res.status(404).json({ message: "Choice not found" });
    }
    return res.json(choice);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
router.delete("/:choieId", async (req, res) => {
  try {
    await Choice.findByIdAndDelete(req.params.choiceId).exec();
    return res.status(200).send(true);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
module.exports = router;
