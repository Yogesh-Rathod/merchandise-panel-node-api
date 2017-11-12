// ========== Global Dependencies ============ // 
const nodemailer = require('nodemailer');

// ========== Local Imports ============= //

const config = require('../config/credentials');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: config.emailUserName,
    pass: config.emailPassword
  }
});

module.exports = (usersEmail, mailType) => {
  
  let emailSubject = '';
  let emailContent = '';

  switch (mailType) {
    case 'vendorAddEmail':
      emailSubject = 'Vendor Added';
      emailContent = `<p>
        You have successfully registered as a vendor on our site with email address: ${usersEmail}. 
      </p>`;
      break;
    case 'vendorInfoUpdated':
      emailSubject = 'Vendor Information Updated';
      emailContent = `<p>
        Hello ${usersEmail}, Your information is successfully updated! 
      </p>`;
      break;
    default:
      break;
  }

  let mailOptions = {
    from: '"Yogesh Rathod 👻" <yr16666@gmail.com>',
    to: usersEmail,
    subject: emailSubject,
    html: emailContent
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('error error', error);
    }
    console.log('Email sent: %s', info.messageId);
  });

};