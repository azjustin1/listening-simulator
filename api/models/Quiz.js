const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Listening = require("./Listening");
const Reading = require("./Reading");
const Writing = require("./Writing");
const Part = require("./Part");
const Question = require("./Question");
const Choice = require("./Choice");

const QuizSchema = new Schema(
  {
    name: { type: String },
    listening: { type: Schema.Types.ObjectId, ref: "Listening" },
    reading: { type: Schema.Types.ObjectId, ref: "Reading" },
    writing: { type: Schema.Types.ObjectId, ref: "Writing" },
    folderId: { type: String, default: null },
    order: { type: Number },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  },
);

// QuizSchema.pre("updateOne", async function (next) {
//   const update = this.getUpdate();
//   try {
//     const quiz = await this.model.findOne(this.getQuery());
//     if (!quiz) {
//       throw new Error("Quiz not found");
//     }
//
//     if (update.listening) {
//       const listening = update.listening;
//       await Listening.findOneAndUpdate(
//         { _id: update.listening._id },
//         update.listening,
//       );
//       for (const part of listening.parts) {
//         await Part.findOneAndUpdate({ _id: part._id });
//
//         for (const question of part.questions) {
//           await Question.findOneAndUpdate({ _id: question._id }, question);
//
//           for ( const choice of question.choices) {
//             await Choice.findOneAndUpdate({ _id: choice._id }, choice);
//           }
//         }
//       }
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });
module.exports = mongoose.model("Quiz", QuizSchema);
