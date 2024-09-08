const express = require("express");
const jsonServer = require("json-server");
const cors = require("cors");
const morgan = require("morgan");
const server = express();
const fs = require("fs");
const dbConfig = require("./configs/db.config");
require("dotenv").config();

server.use(cors());
server.use(morgan());
server.use(express.json());
server.use("/upload", express.static(`${__dirname}/upload`));

// Routers
const router = jsonServer.router("db.json");
const systemRouter = require("./routes/system.router");
const emailRouter = require("./routes/mail.router");
const fileRouter = require("./routes/file.router");
const quizRouter = require("./routes/quiz.router");
const questionRouter = require("./routes/question.router");
const choiceRouter = require("./routes/choice.router");
const selfReadingRouter = require("./routes/self-reading.router");

server.use("/api/system", systemRouter);
server.use("/api/file", fileRouter);
server.use("/api/mail", emailRouter);
server.use("/api/quizzes", quizRouter);
server.use("/api/system", systemRouter);
server.use("/api/self-reading", selfReadingRouter);
server.use("/api/questions", questionRouter);
server.use("/api/choices", choiceRouter);
server.use("/api", router);
const dbPath = "db.json";
fs.watchFile(dbPath, (curr, prev) => {
  console.log("db.json file changed. Reloading database...");
  router.db.read();
});

server.get("*", function (req, res) {
  res.sendFile(__dirname + "/dist/browser/index.html");
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

(async () => {
  await dbConfig();
  // Rest of your application code
})();

server.listen(port, host, () => {
  console.log(`Server is running at port ${host}:${port}`);
});
