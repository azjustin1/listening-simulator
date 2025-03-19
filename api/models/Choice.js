const mongoose = require("mongoose");
const Question = require("./Question");
const Schema = mongoose.Schema;
const ChoiceSchema = Schema({
  content: String,
  questionId: { type: Schema.Types.ObjectId, ref: "Question" },
});
ChoiceSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  const choiceId = doc._id;
  await Question.updateOne(
    { choices: choiceId },
    { $pull: { choices: choiceId } },
  );
  console.log(`Removed question ${choiceId} from its Part`);
});
module.exports = mongoose.model("Choice", ChoiceSchema);
