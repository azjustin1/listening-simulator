const express = require("express");
const Part = require("../models/Part");

const router = express.Router();


router.post("/", (req, res) => {

  const partData = req.body;
})

module.exports = router;
