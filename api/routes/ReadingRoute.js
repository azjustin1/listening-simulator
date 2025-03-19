const express = require("express");
const Quiz = require("../models/Quiz");
const Part = require("../models/Part");
const Reading = require("../models/Reading");
const router = express.Router();
router.get("/", async (req, res) => {
  const allReadingParts = await Reading.find();
  res.status(200).json(allReadingParts);
});
router.get("/:id", async (req, res) => {
  const readingId = req.params.id;
  const reading = await Reading.findById(readingId);
  if (!reading) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.status(200).json(reading);
  }
});
router.post("/", async (req, res) => {
  const readingData = req.body;
  if (!readingData.quizId) {
    res.status(400).json({ message: "quizId is required" });
  }
  const quiz = await Quiz.findById(readingData.quizId);
  if (quiz) {
    try {
      const newReading = await Reading.create(readingData);
      quiz.readingParts = newReading;
      await quiz.save();
      res.status(201).json(newReading);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "Quiz not found" });
  }
});
module.exports = router;
