const mongoose = require("mongoose");
const Part = require("./Part");
const Schema = mongoose.Schema;
const questionSchema = new Schema(
  {
    description: { type: String },
    type: {
      type: String,
      enum: [
        "multiple-choice",
        "short-answer",
        "multiple-questions",
        "dropdown-answer",
        "label-on-map",
        "fill-in-the-gap",
        "matching-header",
        "drag-and-drop-answer",
        "fill-in-table",
        "drag-in-table",
      ],
    },
    choices: [{ type: Schema.Types.ObjectId, ref: "Choice" }],
    partId: { type: Schema.Types.ObjectId, ref: "Part" },
  },
  {
    timestamps: true,
    validate: {
      validator: function () {
        if (this.type === "short-answer") {
          return !this.choices || this.choices.length === 0;
        }
        return this.choices && this.choices.length > 1;
      },
      message:
        "Choices are required for multiple-choice and dropdown-answer, and should be empty for short-answer.",
    },
  },
);
// Post-save middleware to push Question ID to Part
questionSchema.post("save", async function (doc) {
  // Only run for new documents
  const questionId = doc._id;
  const partId = doc.partId; // The Part this Question belongs to
  if (!partId) return; // Skip if no Part is associated
  try {
    await Part.updateOne(
      { _id: partId },
      { $addToSet: { questions: questionId } }, // Use $addToSet to avoid duplicates
    );
  } catch (error) {
    console.error(`Failed to update Part ${partId}:`, error.message);
    // Optionally, rethrow the error if you want to handle it upstream
  }
});
questionSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  const questionId = doc._id;
  await Part.updateOne(
    { questions: questionId },
    { $pull: { questions: questionId } },
  );
  console.log(`Removed question ${questionId} from its Part`);
});
module.exports = mongoose.model("Question", questionSchema);
