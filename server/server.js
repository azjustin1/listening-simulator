require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const server = express();
const dbConfig = require("./configs/db.config");
const passport = require("passport");
const passportConfig = require("./configs/passport.config");

server.use(cors());
server.use(morgan("tiny"));
server.use(express.json());
server.use("/upload", express.static(`${__dirname}/upload`));
server.use(express.static(path.join(__dirname, 'dist/browser')));
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);
server.use(passport.initialize());
passportConfig(passport);

// Routers
const authRouter = require("./routes/auth.router");
const emailRouter = require("./routes/mail.router");
const fileRouter = require("./routes/file.router");
const questionRouter = require("./routes/question.router");
const choiceRouter = require("./routes/choice.router");
const selfReadingRouter = require("./routes/self-reading.router");

server.use("/api/auth", authRouter);
server.use("/api/file", fileRouter);
server.use("/api/mail", emailRouter);
server.use("/api/self-reading", selfReadingRouter);
server.use("/api/questions", questionRouter);
server.use("/api/choices", choiceRouter);
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
