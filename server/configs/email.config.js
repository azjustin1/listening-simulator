const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const transporter = nodemailer.createTransport({
  service: "gmail", // Use a specific email service provider
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASSWORD, // Your email password
  },
  authentication: "plain",
});

module.exports = transporter;
