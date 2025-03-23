const mongoose = require("mongoose");
const Choice = require("./Choice");
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
    partId: { type: Schema.Types.ObjectId, ref: "Part" },
    choices: [{ type: Schema.Types.ObjectId, ref: "Choice" }],
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
  const PartModel = this.model("Part");

  await PartModel.findByIdAndUpdate(
    partId,
    { $addToSet: { questions: questionId } },
  ).exec();
});
questionSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  const questionId = doc._id;
  await Choice.deleteMany({ questionId: questionId }).exec();
});
module.exports = mongoose.model("Question", questionSchema);
