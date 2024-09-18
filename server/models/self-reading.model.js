const mongoose = require("mongoose");
const { Question } = require("./question.model");

// Define the SelfReadingModel schema
const selfReadingSchema = new mongoose.Schema({
  name: { type: String },
  content: { type: String },
  timeout: { type: Number, required: false },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  wordCount: { type: Number },
  testDate: { type: Date },
});

selfReadingSchema.pre("findOneAndDelete", async function (next) {
  try {
    const selfReadingId = this.getFilter()["_id"];
    const selfReading = await mongoose
      .model("SelfReading")
      .findById(selfReadingId)
      .select("questions");
    await mongoose.model("Question").deleteMany({
      _id: { $in: selfReading.questions },
    });
    next();
  } catch (error) {
    next(error);
  }
});

const SelfReading = mongoose.model("SelfReading", selfReadingSchema);

module.exports = SelfReading;
