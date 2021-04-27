const authRoute = require('express').Router();
const Authcontroller = require('../Controller/auth-controller');

authRoute.post('/signup',Authcontroller.signup);
authRoute.post('/signin',Authcontroller.signin);
authRoute.post('/forgotPassword',Authcontroller.forgotpassword)
authRoute.post('/resetpassword/:resetToken',Authcontroller.resetpassword);

module.exports = authRoute;