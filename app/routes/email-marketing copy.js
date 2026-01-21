module.exports = (app) => {
  const db = require('../models/db.js');
  const USERS_BUSINESS_MEDIAS = require('../query/users_business_medias.query.js');

  const CryptoJS = require('crypto-js');
  const JWT_SECRET = process.env.JWT_SECRET;

  const express = require('express');
  const path = require('path');
  const nodemailer = require('nodemailer');
  const hbs = require('nodemailer-express-handlebars');
  app.use(express.static(path.join(__dirname, '../../', 'public')));

 

  app.post('/api/post/email/introduction', (req, res) => {
      console.log('email-payment-account');
      let receiverEmailAddress = 'potolin.federex@gmail.com';

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVERHOST,
          port: process.env.EMAIL_PORT,
          secure: false,
          auth: {
              user: process.env.SUPPORT_RECEIVER_EMAIL_ADDRESS,
              pass: process.env.SUPPORT_RECEIVER_PASSWORD,
          },
          tls: {
              rejectUnauthorized: false,
          },
      });

      const handlebarOptions = {
          viewEngine: {
              extName: '.handlebars',
              partialsDir: path.resolve('./public/view/email'),
              defaultLayout: false,
          },
          viewPath: path.resolve('./public/view/email'),
          extName: '.handlebars',
      };

      transporter.use('compile', hbs(handlebarOptions));

      // setup email data with unicode symbols
      let mailOptions = {
          from: process.env.SUPPORT_RECEIVER_EMAIL_ADDRESS,
          to: receiverEmailAddress,
          subject: 'All World Trade - Introduction to AllWorldTrade platform for boosting market and sales',
          template: 'introduction',
          // context: {
          //     code: verification_code
          // },
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              // return error;
          } else {
              res.send('email sent');
              console.log('Email has been sent');
          }
          // console.log('Message sent info: ', info);
          // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          // res.render('Email has been sent');
      });
  });

  app.post('/api/post/emails/introduction', (req, res) => {
      console.log('email-payment-account');
      let receiverEmailAddress = 'potolin.federex@gmail.com';

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVERHOST,
          port: process.env.EMAIL_PORT,
          secure: false,
          auth: {
              user: process.env.SUPPORT_RECEIVER_EMAIL_ADDRESS,
              pass: process.env.SUPPORT_RECEIVER_PASSWORD,
          },
          tls: {
              rejectUnauthorized: false,
          },
      });

      const handlebarOptions = {
          viewEngine: {
              extName: '.handlebars',
              partialsDir: path.resolve('./public/view/email'),
              defaultLayout: false,
          },
          viewPath: path.resolve('./public/view/email'),
          extName: '.handlebars',
      };

      transporter.use('compile', hbs(handlebarOptions));

      // setup email data with unicode symbols
      let mailOptions = {
          from: process.env.SUPPORT_RECEIVER_EMAIL_ADDRESS,
          to: receiverEmailAddress,
          subject: 'All World Trade - Introduction to AllWorldTrade platform for boosting market and sales',
          template: 'introduction',
          // context: {
          //     code: verification_code
          // },
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              // return error;
          } else {
              res.send('email sent');
              console.log('Email has been sent');
          }
          // console.log('Message sent info: ', info);
          // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          // res.render('Email has been sent');
      });
  });
};
