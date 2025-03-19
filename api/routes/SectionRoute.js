const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("This is section route");
});
router.post("/:quizId", async (req, res) => {
  console.log(req.params.quizId);
  res.send(JSON.stringify(req.body));
});
module.exports = router;
