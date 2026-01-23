const db = require('../db_models');
const sequelizeConfig = require('../config/sequelize.config.js');
const Users_accounts = db.users_accounts;
const Prospects = db.prospects;
const Users_businesses = db.users_businesses;

const Op = db.Sequelize.Op;

const express = require('express');
const path = require('path');
const CryptoJS = require('crypto-js');
const nodemailer = require('nodemailer');
// const hbs = require('nodemailer-express-handlebars');
const hbs = require('nodemailer-express-handlebars').default;

exports.create = async (req, res) => {
    try {
        const { cett_company_name, cett_message } = req.body;
        const traderEmail = await getBusinessEmailByBusinessName(cett_company_name);
        const clientFirstName = req.session.user.first_name;
        const clientLastName = req.session.user.last_name;
        const clientEmail = req.session.user.email_or_social_media;

        const emailData = {
            clientFirstName,
            clientLastName,
            clientEmail,
            traderEmail,
            companyName: cett_company_name,
            message: cett_message,
        };

        console.log('Client Email to Trader emailData v3 :', emailData);

        if (traderEmail) {
            clientEmailTheTrader(emailData);
            sendEmailToClient(clientEmail, traderEmail);
            notifyAWTwhenClientSentEmailToTrader(emailData);
        }

    } catch (error) {
        console.error('Error in notify-trader-on-client-contact:', error);
    }
};



async function getBusinessEmailByBusinessName(businessName) {
    try {
        const result = await Users_businesses.findAll({
            attributes: ['business_email'],
            where: {
                business_name: businessName
            },
            raw: true
        });

        return result[0]?.business_email || null;
    } catch (error) {
        console.error(error);
    }
}


function clientEmailTheTrader(emailData) {
    console.log('clientEmailTheTrader clientEmail :', emailData.clientEmail);
    console.log('clientEmailTheTrader traderEmail :', emailData.traderEmail);
    console.log('clientEmailTheTrader companyName :', emailData.companyName);
    console.log('clientEmailTheTrader message :', emailData.message);

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
        to: emailData.traderEmail,
        subject: 'All World Trade - Client message you.',
        template: 'client-email-the-trader',
        context: {
            emailData: emailData
        },
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('transporter.sendMail error: ', error);
            // return error;
        } else {
            // res.send('email sent');
            console.log('Email has been sent to Trader: ', receiverEmailAddress);
        }
        // console.log('Message sent info: ', info);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // res.render('Email has been sent');
    });
}


function sendEmailToClient(receiverEmailAddress, emailData) {

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
        subject: 'All World Trade - Traders you\'re trying to connect with.',
        template: 'notifyClientOnTraderTheyContact',
        context: {
            emailData: emailData
        },
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('transporter.sendMail error: ', error);
            // return error;
        } else {
            // res.send('email sent');
            console.log('Email has been sent to Client: ', receiverEmailAddress);
        }
        // console.log('Message sent info: ', info);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // res.render('Email has been sent');
    });
}

function notifyAWTwhenClientSentEmailToTrader(emailData) {
    const receiverEmailAddress = 'allworldtrade.com@gmail.com'
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
        subject: 'All World Trade - Client sent a message to a Trader',
        template: 'notifyAWTwhenClientSentEmailToTrader',
        context: {
            emailData: emailData
        },
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('transporter.sendMail error: ', error);
            // return error;
        } else {
            // res.send('email sent');
            console.log('Email has been sent to AWT: ', receiverEmailAddress);
        }
        // console.log('Message sent info: ', info);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // res.render('Email has been sent');
    });
}