const express = require("express");
const Test = require("../models/Test");
const Quiz = require("../models/Quiz");
const router = express.Router();
const populateSection = {
  path: "parts",
  populate: {
    path: "questions",
  },
};
router.get("/", async (req, res) => {
  try {
    const tests = await Test.find();
    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:testId", async (req, res) => {
  try {
    const testId = req.params.testId;
    const test = await Test.findById(testId);
    if (!test) {
      res.status(404).json({ message: "No test found" });
    }
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const newTest = await Test.create(req.body);
    await newTest.save();
    res.status(200).json(newTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/:testId", async (req, res) => {
  const testId = req.params.testId;
  const testData = req.body;
  try {
    const test = await Test.findByIdAndUpdate(testId, {
      studentName: testData.studentName,
      answers: testData.answers,
    }).exec();
    console.log(test);
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:testId", async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.testId);
    res.status(200).send(true);
  } catch (error) {
    res.status(500).send(false);
  }
});
module.exports = router;
