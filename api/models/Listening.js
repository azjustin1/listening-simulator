const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Document = mongoose.Document;

const ListeningSchema = new Schema(
  {
    timeout: { type: Number, default: 0 },
    audioName: { type: String },
    audioUrl: { type: String },
    audioTime: { type: Number, default: 0 },
    description: { type: String },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
    parts: [{ type: Schema.Types.ObjectId, ref: "Part" }],
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  },
);
module.exports = mongoose.model("Listening", ListeningSchema);
