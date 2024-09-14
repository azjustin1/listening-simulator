const express = require("express");
const router = express.Router();
const transporter = require("../configs/email.config");
const path = require("path");
const generatePDF = require("../utils/pdf-generator.config");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Route for sending emails
router.post("/send", (req, res) => {
  // Get the email details from the request body
  const { from, to, cc, subject, text } = req.body;
  // Create a transporter object

  // Define the email options
  let mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    cc: cc,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error);
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).send("Email sent successfully");
    }
  });
});

router.post("/self-reading", async (req, res) => {
  const { html, studentName, studentEmail } = req.body;
  try {
    const fileName = `${studentName}_reading`;
    // Generate PDF
    const pdfPath = await generatePDF(html, fileName);

    // Check if the file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(400).json({ error: "PDF file not found" });
    }

    console.log(pdfPath)

    // Set up email data
    const mailOptions = {
      from: "azjustin3@gmail.com",
      to: studentEmail,
      subject: 'Self reading',
      text: 'This is my self-reading test',
      attachments: [
        {
          filename: `${fileName}.pdf`,
          path: pdfPath,
        },
      ],
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json({ message: "Email sent successfully!", info });
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate PDF or send email",
      details: error.message,
    });
  }
});

module.exports = router;
