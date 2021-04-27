const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = new mongoose.Schema({
    username:{type:String,required:[true,'please enter username']},
    email:{type:String,required:[true,'please enter email']},
    password:{type:String,required:[true,'please enter password'],select:false},
    resetPassword:String,
    resetPasswordExpired:Date
});

User.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(18);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

User.methods.matchPasswords = async function(password) {
    // comparing current user(email,pwd) instance with pwd param
    return await bcrypt.compare(password,this.password);
};

User.methods.getSignedToken = function() {
    //jwt.sign('id/field' , 'custom key' ,'expiry limit' )
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES});
}

User.methods.getResetToken = function() {
    // generate random string
    const resetToken = crypto.randomBytes(20).toString("hex");
    //encrypt with sha256
    this.resetPassword = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpired = Date.now() + 10 *(1000*60);
    return resetToken;
}

const UserModel = mongoose.model("UserCollection",User);

module.exports = UserModel;