const express = require("express");
const jsonServer = require("json-server");
const mongoose = require("mongoose");
const cors = require("cors");
const server = express();
require("dotenv").config();

server.use(express.static(`${__dirname}/dist/browser`));
server.use(cors({ origin: "*" }));
server.use(express.json());
server.use(express.static(`${__dirname}/dist/browser`));
server.use("/mock-test", (req, res) => {
  res.sendFile(`${__dirname}/dist/browser/index.html`);
});
server.use("/edit-quiz/:id", (req, res) => {
  res.sendFile(`${__dirname}/dist/browser/index.html`);
});
server.use("/upload", express.static(`${__dirname}/upload`));

// Routers
const emailRouter = require("./controllers/mail.controller");
const fileRouter = require("./controllers/file.controller");

server.use("/api/file", fileRouter);
server.use("/api/mail", emailRouter);
server.use("/api", jsonServer.router("db.json"));
server.get("*", function (req, res) {
  res.sendFile(__dirname + "/dist/browser/index.html");
});

const port = process.env.PORT || 3000;

mongoose.connect("mongodb://0.0.0.0:27017/listening-simulator", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

server.listen(3000, '192.168.1.10', () => {
  console.log(`Server is running at port ${port}`);
});
