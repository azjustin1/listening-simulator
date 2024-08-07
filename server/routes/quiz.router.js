const express = require("express");
const fs = require("fs");
const jsonServer = require("json-server");

const router = express.Router();

router.patch("/update", (req, res) => {
  const jsonServerDB = jsonServer.router("db.json").db;
  const db = jsonServerDB.getState();
  const updates = req.body;

  // Update the items in the database
  updates.forEach((update) => {
    const index = db.quizzes.findIndex((item) => item.id === update.id);
    if (index !== -1) {
      db.quizzes[index] = { ...db.quizzes[index], ...update };
    }
  });

  // Save the updated database
  jsonServerDB.write(db);

  // Return the updated items
  res.jsonp(updates);
});

router.patch("/update-folder", (req, res) => {
  let db = JSON.parse(fs.readFileSync("db.json", "utf8"));
  // Update the items in the database
  db.quizzes = db.quizzes.map((quiz) => {
    return { ...quiz, folderId: null };
  });

   // Save the updated database
   fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

  // Return the updated items
  res.status(200).send(db.quizzes);
});

module.exports = router;
