const express = require("express");
const router = express.Router();
const Result = require("../models/result.model");

const NOT_FOUND = "Result not found";

// Create a new result
router.post("/", async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all results
router.get("/", async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single result by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id, {
      "listeningParts.questions.correctAnswer": 0,
      "listeningParts.questions.choices.correctAnswer": 0,
      "readingParts.questions.correctAnswer": 0,
      "readingParts.questions.choices.correctAnswer": 0,
    });
    if (!result) {
      return res.status(404).json({ message: NOT_FOUND });
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a result by ID
router.put("/:id", async (req, res) => {
  try {
    const resultData = req.body;
    const result = await Result.findByIdAndUpdate(req.params.id, resultData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a result by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: NOT_FOUND });
    }
    res.json(true);
  } catch (err) {
    res.status(400).json({ error: error.message });
  }
});

async function getResult(req, res, next) {
  let result;
  try {
    result = await Result.findById(req.params.id);
    if (result == null) {
      return res.status(404).json({ message: NOT_FOUND });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }

  res.result = result;
  next();
}

module.exports = router;
