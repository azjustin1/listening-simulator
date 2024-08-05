const express = require("express");
const jsonServer = require("json-server");
const cors = require("cors");
const server = express();
require("dotenv").config();

server.use(express.static(`${__dirname}/dist/browser`));
server.use(cors({ origin: "*" }));
server.use(express.json());
server.use("/upload", express.static(`${__dirname}/upload`));

// Routers
const emailRouter = require("./routes/mail.router");
const fileRouter = require("./routes/file.router");
const folderRouter = require("./routes/folder.router");

server.use("/api/file", fileRouter);
server.use("/api/mail", emailRouter);
server.use("/api/folder", folderRouter);
server.use("/api", jsonServer.router("db.json"));
server.get("*", function (req, res) {
  res.sendFile(__dirname + "/dist/browser/index.html");
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
