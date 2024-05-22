require("dotenv").config();
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const emailTemplatePath = path.join(
  __dirname,
  "../templates/resetPasswordTemplate.hbs"
);
const emailTemplateSource = fs.readFileSync(emailTemplatePath, "utf8");
const template = handlebars.compile(emailTemplateSource);

exports.sendEmail = async function ({ to, subject, text, html }) {
  const templateData = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    mobile: mobile,
    message: message,
  };
  const renderedHtml = template(templateData);

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: process.env.TO_EMAIL,
    subject: "Website Inquiry",
    text: message,
    html: renderedHtml,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json({ status: false });
    } else {
      console.log("Email Sent");
      res.json({ status: true });
    }
  });
};
