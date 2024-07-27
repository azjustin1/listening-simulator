const express = require("express");
const jsonServer = require("json-server");
const cors = require("cors");
const server = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
require('dotenv').config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir = `${__dirname}/upload`;
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

server.use(express.static(`${__dirname}/dist/browser`));
server.use(cors({ origin: "http://localhost:4200" }));
server.use(express.json());
server.use('/upload', express.static(`${__dirname}/upload`))

server.post("/api/upload", upload.single("file"), (req, res) => {
  // Access uploaded file information using req.file
  if (req.file) {
    // File was uploaded successfully
    res.status(200).send({ fileName: req.file.filename });
  } else {
    // No file was uploaded or an error occurred
    res.status(400).send("No file uploaded or an error occurred.");
  }
});

server.get("/api/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "upload", filename);

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

server.delete("/api/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "upload", filename);

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

server.use("/api", jsonServer.router("db.json"));
server.get('*', function(req, res){
  res.sendFile(__dirname + "/dist/browser/index.html");
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

server.listen(port, () => {
  console.log(`Server is running at port ${host}:${port}`);
});
