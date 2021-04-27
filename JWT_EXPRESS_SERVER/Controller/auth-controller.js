const UserCollection = require('../Model/user.model');
const ErrorResponse = require('../Utils/ErrorResponse');
const SendEmail = require('../Utils/sendEmail');
const Crypto = require('crypto');
//sign up
exports.signup = async (req,res,next) => {
    const {username,email,password} = req.body;
    try {
        const user = await UserCollection.create({username,email,password});
        sendToken(user,201,res);

    } catch (error) {
        res.status(500).json({success:false,error:error.message});
        console.log(error.message);
    }
};

//sign in
exports.signin = async (req,res,next) => {
    const {email,password} = req.body;
    try {
        if(!email || !password) {
            return next(new ErrorResponse("Invalid Credentials",400));
        }
        const user = await UserCollection.findOne({email}).select("+password");
        if(!user) {
            return next(new ErrorResponse("Invalid Credentials",400));
        }
        const isMatch = await user.matchPasswords(password);
        if(!isMatch) {
            return next(new ErrorResponse("Invalid password",400));
        }

       sendToken(user,200,res);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,error:error.message});
    }
}

//forgot password
exports.forgotpassword = async (req,res,next) => {
    const {email} = req.body;
    console.log(email);
    try {
        const user = await UserCollection.findOne({email});
        if(!user) {
            return next(new ErrorResponse("Could find the account in server. please signup !",404));
        }
        const resetToken = user.getResetToken();
        await user.save();

        const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
        const mailMessage = `
                <h1> Password Reset </h1>
                <br/> <br/>
                <p> please click this link to change your password </p>
                <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

        try {
            await SendEmail({emailTo:user.email,emailSubject:'JWT:Password Reset',emailText:mailMessage});
            res.status(200).json({success:true,data:'Email Sent Successfully !'});
        } catch (error) {
            this.resetPassword = undefined;
            this.resetPasswordExpired = undefined;
            await user.save();
            return next(new ErrorResponse("Error While Sending Email",500));
        }

    } catch (error) {
        console.log(error.message);
        next(error);
    }
}


//reset password
exports.resetpassword = async (req,res,next) => {
    const resetPasswordToken = Crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    try {
        const user = await UserCollection.findOne({resetPassword:resetPasswordToken,resetPasswordExpired:{$gt:Date.now()}});
        if(!user) {
            return next(new ErrorResponse("Invalid request/session expired!"));
        }
        user.password = req.body.password;
        user.resetPasswordExpired = undefined;
        user.resetPassword = undefined;
        await user.save();
        res.status(200).json({success:true,data:'Password Reset Successful !'});
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

//it will create a new toke with id field and send back to client
const sendToken = (user,statusCode,res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({success:true,token});
}