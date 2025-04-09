const express = require("express");
const connectDB = require("./configs/db.conf");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(`${__dirname}/uploads`));
app.get("/", (req, res) => {
  res.send("Hello");
});
// Routes
const quizRoutes = require("./routes/QuizRoute");
const testRoutes = require("./routes/TestRoute");
const questionRoutes = require("./routes/QuestionRoute");
const choiceRoutes = require("./routes/ChoiceRoute");
const partRoute = require("./routes/PartRoute");
const sectionRoute = require("./routes/SectionRoute");
const fileRoute = require("./routes/FileRoute");
app.use("/api/quizzes", quizRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/choices", choiceRoutes);
app.use("/api/parts", partRoute);
app.use("/api/sections", sectionRoute);
app.use("/file", fileRoute);
connectDB().catch((error) => {
  return process.exit(1);
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
