const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create transporter (Mailtrap for dev)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define mail options
  const mailOptions = {
    from: 'Marketplace App <marketplace@example.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
