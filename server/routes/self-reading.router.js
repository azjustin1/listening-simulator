const express = require("express");
const router = express.Router();

const SelfReading = require("../models/self-reading.model");
const Question = require("../models/question.model");

// Create a new SelfReading
router.post("/", async (req, res) => {
  try {
    const readingTest = req.body;
    if (readingTest._id) {
      const updateReadingTest = await SelfReading.findOneAndUpdate(
        { _id: readingTest._id },
        readingTest,
        { upsert: true },
      );
      res.status(201).send(updateReadingTest);
    }
    const newReadingTest = new SelfReading(readingTest);
    const savedReadingTest = await newReadingTest.save();
    res.status(201).send(savedReadingTest);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all SelfReadings
router.get("/", async (req, res) => {
  try {
    const selfReadings = await SelfReading.find();
    res.status(200).send(selfReadings);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a specific SelfReading by ID
router.get("/:id", async (req, res) => {
  try {
    const selfReading = await SelfReading.findById(req.params.id).populate({
      path: "questions",
      populate: [
        {
          path: "subQuestions",
          populate: {
            path: "choices",
          },
        },
        { path: "choices" },
      ],
    });

    if (!selfReading) {
      return res.status(404).send();
    }
    res.status(200).send(selfReading);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a SelfReading by ID
router.patch("/", async (req, res) => {
  const selfReading = req.body;
  try {
    const existedSelfReading = await SelfReading.findByIdAndUpdate(
      selfReading._id,
      selfReading,
      { runValidators: true },
    );
    if (!existedSelfReading) {
      return res.status(404).send();
    }
    res.send(existedSelfReading);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a SelfReading by ID
router.delete("/:id", async (req, res) => {
  try {
    const selfReading = await SelfReading.findByIdAndDelete(req.params.id);
    if (!selfReading) {
      return res.status(404).send();
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a question by ID
router.delete("/questions/:questionId", async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.questionId);
    if (!question) {
      return res.status(404).send();
    }

    await SelfReading.updateMany(
      { questions: question._id },
      { $pull: { questions: question._id } },
    );

    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
