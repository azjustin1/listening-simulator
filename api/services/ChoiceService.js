const ChoiceModel = require("../models/Choice");

async function create(choice) {
  const newChoice = await ChoiceModel.create(choice);
  return newChoice;
}

async function show(id) {
  const choice = await ChoiceModel.findById(id).exec();
  if (!choice) {
    throw new Error("Choice not found");
  }
  return choice;
}

async function update(id, choice) {
  const updatedChoice = await ChoiceModel.findByIdAndUpdate(id, choice, {
    new: true,
  }).exec();
  if (!updatedChoice) {
    throw new Error("Choice not found");
  }
  return updatedChoice;
}

async function destroy(id) {
  const deletedChoice = await ChoiceModel.findByIdAndDelete(id).exec();
  if (!deletedChoice) {
    throw new Error("Choice not found");
  }
  return "Choice deleted successfully";
}

module.exports = { create, show, update, destroy };
