const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const Part = require("../models/Part");
const Question = require("../models/Question");
const Choice = require("../models/Choice");
const Listening = require("../models/Listening");
const Reading = require("../models/Reading");
const Writing = require("../models/Writing");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const populatePart = {
  path: "parts",
  populate: { path: "questions", populate: "choices" },
};
const findQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).exec();
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    req.quiz = quiz;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const findPart = async (req, res, next) => {
  try {
    const part = await Part.findById(req.params.partId);
    if (!part) {
      res.status(404).json({ message: "Part not found" });
    }
    req.part = part;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
router.post("/", async (req, res) => {
  const quizData = req.body;
  const newListeningPart = await Part.create({});
  await newListeningPart.save();
  const listening = new Listening({
    parts: [newListeningPart],
  });
  const newReadingPart = await Part.create({});
  await newReadingPart.save();
  const reading = new Reading({
    parts: [newReadingPart],
  });
  const newWritingPart = await Part.create({});
  await newWritingPart.save();
  const writing = new Writing({
    parts: [newWritingPart],
  });
  const newQuiz = new Quiz({
    name: quizData.name,
    listening: listening,
    reading: reading,
    writing: writing,
  });
  await newQuiz.save();
  listening.quizId = newQuiz._id;
  await listening.save();
  reading.quizId = newQuiz._id;
  await reading.save();
  writing.quizId = newQuiz._id;
  await writing.save();
  res.status(201).send(newQuiz);
});
router.put("/:quizId", async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const updateQuizData = req.body;
    const savedQuiz = await Quiz.findByIdAndUpdate(quizId, updateQuizData);
    res.json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Update a Quiz
router.put("/:quizId", async (req, res) => {
  const quizId = req.params.id;
  const updatedQuizData = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    const updatedParts = [];
    for (const partData of updatedQuizData.parts) {
      let part = await Part.findOne({ title: partData.title, quiz: quizId });
      if (!part) {
        part = new Part({
          title: partData.title,
          description: partData.description,
          quiz: quiz._id,
          questions: [],
        });
        await part.save();
      } else {
        part.description = partData.description || part.description;
      }
      const updatedQuestions = [];
      for (const questionData of partData.questions) {
        let question = await Question.findOne({
          text: questionData.text,
          part: part._id,
        });
        if (!question) {
          // Create new question
          question = new Question({
            text: questionData.text,
            type: questionData.type,
            choices: [], // Initially empty
            correctAnswer: questionData.correctAnswer,
            part: part._id,
          });
          await question.save();
          // Save new choices
          let choiceIds = [];
          if (questionData.choices && questionData.choices.length > 0) {
            const choicesData = questionData.choices.map((choiceText) => ({
              text: choiceText,
              question: question._id, // Set question reference here
            }));
            const savedChoices = await Choice.insertMany(choicesData);
            choiceIds = savedChoices.map((ch) => ch._id);
          }
          question.choices = choiceIds;
          await question.save();
        } else {
          // Update existing question
          question.type = questionData.type || question.type;
          question.correctAnswer =
            questionData.correctAnswer || question.correctAnswer;
          if (questionData.choices) {
            // Delete old choices and create new ones
            await Choice.deleteMany({ question: question._id });
            const choicesData = questionData.choices.map((choiceText) => ({
              text: choiceText,
              question: question._id,
            }));
            const savedChoices = await Choice.insertMany(choicesData);
            question.choices = savedChoices.map((ch) => ch._id);
          }
          await question.save();
        }
        updatedQuestions.push(question._id);
      }
      part.questions = updatedQuestions;
      await part.save();
      updatedParts.push(part._id);
    }
    quiz.title = updatedQuizData.title || quiz.title;
    quiz.description = updatedQuizData.description || quiz.description;
    quiz.parts = updatedParts;
    await quiz.save();
    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating quiz", error: error.message });
  }
});
// Get a Quiz
router.get("/:quizId", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate({
        path: "listening",
        populate: populatePart,
      })
      .populate({
        path: "reading",
        populate: populatePart,
      })
      .populate({
        path: "writing",
        populate: populatePart,
      });
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
    } else {
      res.status(200).json(quiz);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching quiz", error: error.message });
  }
});
// Get All Quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate({
      path: "parts",
      strictPopulate: false,
      populate: {
        path: "questions",
        populate: { path: "choices" },
      },
    });
    res.status(200).json(quizzes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching quizzes", error: error.message });
  }
});
// Submit a Quiz
router.post("/:quizId/submit", async (req, res) => {
  const quizId = req.params.id;
  const { user, answers } = req.body; // Expecting user ID/name and array of { questionId, selectedAnswer }
  try {
    // Fetch the quiz with correct answers for scoring
    const quiz = await Quiz.findById(quizId).populate({
      path: "parts",
      populate: {
        path: "questions",
        populate: { path: "choices" },
      },
    });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    // Flatten questions from all parts for easier lookup
    const allQuestions = quiz.parts.reduce(
      (acc, part) => acc.concat(part.questions),
      [],
    );
    // Process answers and calculate score
    const processedAnswers = [];
    let score = 0;
    for (const userAnswer of answers) {
      const question = allQuestions.find(
        (q) => q._id.toString() === userAnswer.questionId,
      );
      if (!question) continue; // Skip invalid question IDs
      const isCorrect = question.correctAnswer === userAnswer.selectedAnswer;
      if (isCorrect) score++;
      processedAnswers.push({
        question: question._id,
        selectedAnswer: userAnswer.selectedAnswer,
        isCorrect: isCorrect,
      });
    }
    // Save the result
    const result = new Result({
      user,
      quiz: quiz._id,
      answers: processedAnswers,
      score,
    });
    await result.save();
    res.status(201).json({
      message: "Quiz submitted successfully",
      result: {
        _id: result._id,
        user: result.user,
        quiz: result.quiz,
        score: result.score,
        submittedAt: result.submittedAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting quiz", error: error.message });
  }
});
const audioStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let uploadDir = path.join(__dirname, "../uploads/audios");
    try {
      await fs.access(uploadDir);
      cb(null, uploadDir);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.mkdir(uploadDir, { recursive: true });
      } else {
        cb(error);
      }
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.replace(/\s/g, ""));
  },
});
const uploadAudio = multer({ storage: audioStorage });
router.post(
  "/:sectionId/upload-audio",
  uploadAudio.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    const sectionId = req.params.sectionId;
    const fileName = req.file.filename;
    const fileUrl = `http://localhost:3000/uploads/audios/${fileName}`;
    await Listening.findByIdAndUpdate(sectionId, {
      audioUrl: fileUrl,
      audioName: fileName,
    }).exec();
    res.json({
      success: 1,
      file: {
        fileName: fileName,
        fileUrl: fileUrl,
      },
    });
  },
);
router.delete("/:sectionId/remove-audio", async (req, res) => {
  try {
    const sectionId = req.params.sectionId;
    const section = await Listening.findById(sectionId);
    if (!section) {
      res.status(404).json({ message: "No section found" });
    }
    const filename = section.audioName;
    const filePath = path.join(__dirname, `../uploads/audios/${filename}`);
    await fs.unlink(filePath);
    await Listening.findByIdAndUpdate(sectionId, {
      audioUrl: "",
      audioName: "",
    }).exec();
    res.status(200).send(true);
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(500).json({ error: err.message });
  }
});
router.post("/:quizId/section", findQuiz, async (req, res) => {
  const quiz = req.quiz;
  const sectionData = req.body;
  try {
    let saveData;
    if (sectionData.sectionType === "listening") {
      const listening = new Listening({
        parts: [],
      });
      await listening.save();
      quiz.listening = listening;
      await quiz.save();
      saveData = await listening.save();
    }
    if (sectionData.sectionType === "reading") {
      const reading = Reading.create(sectionData);
      await reading.save();
      quiz.reading = reading;
      saveData = await reading.save();
    }
    if (sectionData.sectionType === "writing") {
      const writing = Writing.create(sectionData);
      await writing.save();
      quiz.writing = writing;
      saveData = await writing.save();
    }
    if (saveData) {
      res.status(200).send(saveData._id);
    } else {
      res.status(400).json({ message: "Invalid section type" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error add new section", error: error.message });
  }
});
router.post("/:quizId/section/:sectionId/parts", findQuiz, async (req, res) => {
  const partData = req.body;
  try {
    let savedPart;
    if (partData._id) {
      savedPart = await Part.findByIdAndUpdate(partData._id, partData);
    } else {
      savedPart = await Part.create(partData);
      await savedPart.save();
    }
    switch (partData.sectionType) {
      case "listening":
        const listening = await findListeningSection(req, res);
        listening.parts.push(savedPart);
        await listening.save();
        break;
      case "reading":
        const reading = await findReadingSection(req, res);
        break;
      case "writing":
        break;
    }
    res.status(200).send(savedPart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting quiz", error: error.message });
  }
});
router.delete("/:quizId", findQuiz, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.quizId);
    res.status(200).send(true);
  } catch (error) {
    res.status(500).send(false);
  }
});
const findListeningSection = async (req, res, sessionId) => {
  const sectionId = req.params.sectionId;
  const listening = await Listening.findById(sectionId);
  if (!listening) {
    res.status(404).json({ message: "No Listening section found" });
  }
  return listening;
};
const findReadingSection = async (req, res) => {
  const sectionId = req.params.sectionId;
  const reading = await Reading.findById(sectionId);
  if (!reading) {
    res.status(404).json({ message: "No Reading section found" });
  }
  return reading;
};
const findWritingSection = async (req, res) => {
  const sectionId = req.params.sectionId;
  const writing = await Writing.findById(sectionId);
  if (!writing) {
    res.status(404).json({ message: "No Writing section found" });
  }
  return writing;
};
const addOrUpdateQuestion = async (req, res, questionData) => {
  try {
    if (questionData._id) {
      const updateQuestion = await Question.findByIdAndUpdate(
        questionData._id,
        questionData,
      );
      res.status(200).json(updateQuestion);
    } else {
      const part = await Part.findById(req.params.partId);
      if (!part) {
        res.status(404).json({ message: "No Part with ID" });
      }
      const newQuestion = await Question.create({
        type: questionData.type,
        partId: part._id,
      });
      await newQuestion.save();
      part.questions.push(newQuestion);
      await part.save();
      res.status(200).json(newQuestion);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding question", error: error.message });
  }
};
module.exports = router;
