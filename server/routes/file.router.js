const express = require("express");
const router = express.Router();
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary");
const puppeteer = require("puppeteer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir = path.join(__dirname, "../upload");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    // Specify the directory where uploaded files will be stored
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Define the file name for the uploaded file
    cb(null, file.originalname.replace(/\s/g, ""));
  },
});

// Create an instance of Multer with the storage configuration
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  // Access uploaded file information using req.file
  if (req.file) {
    // File was uploaded successfully
    cloudinary.v2.config({
      cloud_name: "gymmerify",
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    const path = req.file.path;
    cloudinary.uploader.upload(path, async (image) => {
      if (!image) {
        return res.status(400).send("Upload failed");
      }
      // remove file from server if don't remove it will save image in server folder
      fs.unlinkSync(path);
      return res.status(200).send({ fileName: image.url });
    });
  } else {
    // No file was uploaded or an error occurred
    res.status(400).send("No file uploaded or an error occurred.");
  }
});

router.post("/generate-pdf", async (req, res) => {
  try {
    const htmlString = req.body.html; // Get HTML string from request body
    const outputDir = path.join(__dirname, "../upload");
    const outputPath = path.join(outputDir, "output.pdf");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(htmlString); // Set the HTML content
    await page.pdf({
      path: outputPath, // Save as output.pdf
      format: "A4", // Paper format
      printBackground: true, // Print background graphics
    });

    await browser.close();

    res.download(outputPath, "output.pdf", (err) => {
      if (err) {
        console.error("Error sending PDF:", err);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../upload", filename);
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate headers for file download
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/octet-stream");

    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // File not found
    res.status(404).send("File not found");
  }
});

router.delete("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../upload", filename);

  // Delete the file
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).send("Failed to delete the file");
      }

      res.status(200).send({ message: "File removed successfully" });
    });
  } else {
    return res.status(200).send({ message: "File removed successfully" });
  }
});

module.exports = router;
