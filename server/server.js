const express = require("express");
const jsonServer = require("json-server");
const cors = require("cors");
const morgan = require("morgan");
const server = express();
const dbConfig = require("./configs/db.config");
require("dotenv").config();

server.use(morgan());
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
const quizRouter = require("./routes/quiz.routes");
const resultRouter = require("./routes/result.routes");

server.use("/api/file", fileRouter);
server.use("/api/mail", emailRouter);
server.use("/api/quizzes", quizRouter);
server.use("/api/results", resultRouter);
server.use("/api", jsonServer.router("db.json"));
server.get("*", function (req, res) {
  res.sendFile(__dirname + "/dist/browser/index.html");
});

(async () => {
  await dbConfig();
  // Rest of your application code
})();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
