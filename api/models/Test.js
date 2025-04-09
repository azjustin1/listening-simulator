const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const testSchema = new Schema(
  {
    studentName: { type: String, default: "" },
    answers: { type: Map, of: String, default: () => new Map() },
    isFinished: { type: Boolean, default: false },
    listening: { type: Schema.Types.Mixed },
    reading: { type: Schema.Types.Mixed },
    writing: { type: Schema.Types.Mixed },
    quizId: { type: String },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Test", testSchema);
