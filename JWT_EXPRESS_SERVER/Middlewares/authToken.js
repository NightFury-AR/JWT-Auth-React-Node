const jwt = require('jsonwebtoken');
const User = require('../Model/user.model');
const ErrorResponse = require('../Utils/ErrorResponse');

exports.protect = async (req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    if(!token) {
        return next(new ErrorResponse("UnAuthorized Access !",401));
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) {
            return next(new ErrorResponse("user not found / session Expired!",404));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse("Not Authorized to access this page",401));
    }
}