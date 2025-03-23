const mongoose = require("mongoose");
const Listening = require("./Listening");
const Reading = require("./Reading");
const Writing = require("./Writing");
const Question = require("./Question");
const Schema = mongoose.Schema;
const PartSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true },
);
PartSchema.post("save", async function (doc) {
  if (!doc) return;
  const partId = doc._id;
  const sectionId = doc.sectionId;
  await this.model("Listening").findOneAndUpdate(
    { _id: sectionId },
    {
      $addToSet: { parts: partId },
    },
  ).exec();
  await this.model("Reading")
    .findOneAndUpdate(
      { _id: sectionId },
      {
        $addToSet: { parts: partId },
      },
    )
    .exec();
  await this.model("Writing").findOneAndUpdate(
    { _id: sectionId },
    {
      $addToSet: { parts: partId },
    },
  ).exec();
});
module.exports = mongoose.model("Part", PartSchema);
