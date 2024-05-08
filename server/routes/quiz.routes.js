const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz.model"); // Assuming the Mongoose model is defined in a separate file

// Create a quiz
router.post("/", async (req, res) => {
  try {
    const quizData = req.body;
    const quiz = await Quiz.create(quizData);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a quiz
router.put("/:id", async (req, res) => {
  try {
    const quizData = req.body;
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, quizData, {
      new: true,
    });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a quiz
router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
