const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReadingSchema = new Schema(
  {
    timeout: { type: Number, default: 0 },
    description: { type: String },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
    parts: [{ type: Schema.Types.ObjectId, ref: "Part" }],
    timeLimit: { type: Number },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  },
);
module.exports = mongoose.model("Reading", ReadingSchema);
