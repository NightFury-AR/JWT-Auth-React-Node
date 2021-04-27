const nodemailer = require('nodemailer');
const { translateAliases } = require('../Model/user.model');

const sentEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service:process.env.EMAIL_SERVICE,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from:process.env.EMAIL_FROM,
        to:options.emailTo,
        subject:options.emailSubject,
        html:options.emailText
    }

    transporter.sendMail(mailOptions,function(err,info) {
        if(err) {
            console.log('error while sending email', err.message);
        }
        else {
            console.log('email status : ',info);
        }
    })
}

module.exports = sentEmail;