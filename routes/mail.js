const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const dotenv = require('dotenv').config();
const moment = require('moment');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'ap-south-1',
});

const transport = nodemailer.createTransport({
    SES: new AWS.SES({
        apiVersion: 'latest'
    })
})

router.post('/', function (req, res, next) {
    try {
        const { email } = req.body;

        const otpNumber = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        transport.sendMail({
            from: 'bebe@creole.tech',
            to: email,
            subject: 'OTP',
            text: otpNumber
        });

        const currentDateTimeInUTC = moment.utc().format();

        return res.send({
            opt: otpNumber,
            current_date_time_utc: currentDateTimeInUTC
        });
    } catch (error) {
        return res.send({
            message: error.message
        })
        // next(error);
    }
});

module.exports = router;