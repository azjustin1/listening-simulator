const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = path.join(__dirname, "../uploads/images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}-${Date.now()}`);
  },
});
const uploadImage = multer({ storage: imageStorage });
router.post("/upload", uploadImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  const fileUrl = `http://localhost:3000/uploads/images/${req.file.filename}`;
  res.json({
    success: 1,
    file: {
      url: fileUrl,
    },
  });
});
router.post("/fetchUrl", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: 0, message: "No URL provided" });
  }
  res.json({
    success: 1,
    file: {
      url: url,
    },
  });
});
module.exports = router;
