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
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/questions", async (req, res) => {
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
          popuplate: {
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
    console.log(error);
    res.status(500).send(error);
  }
});

// Add a question to a SelfReading
router.post("/:id/questions", async (req, res) => {
  try {
    const selfReading = await SelfReading.findById(req.params.id);
    if (!selfReading) {
      return res.status(404).send();
    }

    const newQuestion = new Question({
      ...req.body,
      selfReading: selfReading._id,
    });
    await newQuestion.save();

    selfReading.questions.push(newQuestion._id);
    await selfReading.save();

    res.status(201).send(newQuestion);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a SelfReading by ID
router.patch("/:id", async (req, res) => {
  try {
    const selfReading = await SelfReading.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!selfReading) {
      return res.status(404).send();
    }
    res.send(selfReading);
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
