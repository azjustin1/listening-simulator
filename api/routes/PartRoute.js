const express = require("express");
const router = express.Router();
const Part = require("../models/Part");
const Listening = require("../models/Listening");
const Reading = require("../models/Reading");
const Writing = require("../models/Writing");
const Question = require("../models/Question");
const Choice = require("../models/Choice");
// Create a new part
router.post("/", async (req, res) => {
  try {
    const part = new Part(req.body);
    const savePart = await part.save();
    res.status(200).json(savePart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Get all parts
router.get("/parts", (req, res) => {
  Part.find().exec((err, parts) => {
    if (err) return res.status(500).send(err);
    res.send(parts);
  });
});
// Get a single part by ID
router.get("/parts/:id", (req, res) => {
  Part.findById(req.params.id).exec((err, part) => {
    if (err) return res.status(404).send(err);
    if (!part) return res.status(404).send("Part not found");
    res.send(part);
  });
});
// Update a part by ID
router.put("/parts/:id", (req, res) => {
  Part.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(
    (err, updatedPart) => {
      if (err) return res.status(500).send(err);
      if (!updatedPart) return res.status(404).send("Part not found");
      res.send(updatedPart);
    },
  );
});
// Delete a part by ID
router.delete("/:partId", async (req, res) => {
  const partId = req.params.partId;
  const existedPart = await Part.findById(partId);
  if (!existedPart) return res.status(404).send("Part not found");
  if (existedPart) {
    const sectionId = existedPart.sectionId;
    await Listening.findOneAndUpdate(
      { _id: sectionId },
      {
        $pull: { parts: partId },
      },
    ).exec();
    await Reading.findByIdAndUpdate(sectionId, {
      $pull: { parts: partId },
    }).exec();
    await Writing.findByIdAndUpdate(sectionId, {
      $pull: { parts: partId },
    }).exec();
    const questions = await Question.find({ partId: partId });
    if (questions) {
      for (const question of questions) {
        await Choice.deleteMany({ questionId: question.id }).exec();
      }
    }
    await Question.deleteMany({ partId: partId }).exec();
    await Part.deleteOne({ _id: partId }).exec();
    return res.status(200).send(true);
  } else {
    return res.status(404).send(false);
  }
});
module.exports = router;
