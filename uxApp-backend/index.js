'use strict';
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");


const app = express();
const cors = require('cors')

var corsOptions = {
    origin: 'http://ux-app-ais.surge.sh',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(8000, () => {
    console.log('Server started!');
});
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(bodyParser.json());
app.route('/api/sendEmail').post((req, res) => {
    console.log(req.body);
    sendEmail(req.body);
    res.send(true);
});
function sendEmail(req){
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'psts.ux.app@gmail.com', // generated ethereal user
                pass: 'Mm@123456' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from:'psts.ux.app@gmail.com', // sender address
            to: req.to, // list of receivers
            subject: req.subject, // Subject line
            text: req.text, // plain text body
            html: req.text, // html body
            attachments: [
                {   // use URL as an attachment
                    filename: req.attachmentName,
                    path: req.attachmentData,
                    contentType:'application/msword'
                }
            ]
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}