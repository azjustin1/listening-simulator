const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.beablevn-api.io.vn",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASSWORD, // Your email password
  },
  authentication: "plain",
});

module.exports = transporter;
