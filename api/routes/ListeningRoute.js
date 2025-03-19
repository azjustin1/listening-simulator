const express = require("express");
const Quiz = require("../models/Quiz");
const Part = require("../models/Part");
const Listening = require("../models/Listening");
const router = express.Router();
router.get("/", async (req, res) => {
  const allListeningParts = await Listening.find();
  res.status(200).json(allListeningParts);
});
router.get("/:id", async (req, res) => {
  const listeningId = req.params.id;
  const listening = await Listening.findById(listeningId);
  if (!listening) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.status(200).json(listening);
  }
});
router.post("/", async (req, res) => {
  const listeningData = req.body;
  if (!listeningData.quizId) {
    res.status(400).json({ message: "quizId is required" });
  }
  const quiz = await Quiz.findById(listeningData.quizId);
  if (quiz) {
    try {
      const newListening = await Listening.create(listeningData);
      quiz.listeningParts = newListening;
      await quiz.save();
      res.status(201).json(newListening);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: "Quiz not found" });
  }
});
module.exports = router;
