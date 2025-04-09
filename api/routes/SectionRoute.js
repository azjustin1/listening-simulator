const express = require("express");
const Listening = require("../models/Listening");
const Reading = require("../models/Reading");
const Writing = require("../models/Writing");
const router = express.Router();
router.put("/:sectionId", async (req, res) => {
  const sectionId = req.params.sectionId;
  try {
    console.log(req.body)
    const savedListening = await Listening.findByIdAndUpdate(
      sectionId,
      req.body,
    )
      .populate({
        path: "parts",
        populate: { path: "questions", populate: "choices" },
      })
      .exec();
    if (savedListening) {
      return res.status(200).json(savedListening);
    }
    const savedReading = await Reading.findByIdAndUpdate(sectionId, req.body)
      .populate({
        path: "parts",
        populate: { path: "questions", populate: "choices" },
      })
      .exec();
    if (savedReading) {
      return res.status(200).json(savedReading);
    }
    const savedWriting = await Writing.findByIdAndUpdate(sectionId, req.body)
      .populate({
        path: "parts",
        populate: { path: "questions", populate: "choices" },
      })
      .exec();
    if (savedWriting) {
      return res.status(200).json(savedWriting);
    }
    return res.status(404).json({ message: "Section not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
