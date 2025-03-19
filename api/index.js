const express = require("express");
const connectDB = require("./configs/db.conf");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello");
});
// Routes
const quizRoutes = require("./routes/QuizRoute");
const questionRoutes = require("./routes/QuestionRoute");
const choiceRoutes = require("./routes/ChoiceRoute");
const listeningRoute = require("./routes/ListeningRoute");
const readingRoute = require("./routes/ReadingRoute");
const sectionRoute = require("./routes/SectionRoute");
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/choices", choiceRoutes);
app.use("/listening", listeningRoute);
app.use("/reading", readingRoute);
app.use("/api/quizzes/:quizId/section", sectionRoute);
connectDB().catch((error) => {
  return process.exit(1);
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
