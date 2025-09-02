import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    avatar: [{
        type: {
            url: String,
            localpath: String
        },
        default: {
            url: "https://placehold.co/",
            localpath: ''
        }
    }],
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiry: {
        type: Date
    },
    refreshToken: {
        type: String
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpiry: {
        type: Date
    }
}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        id: this._id,
        email: this.email,
        username: this.username
    },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        id: this._id,
        email: this.email,
        username: this.username
    },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
}

userSchema.methods.generateTemporaryToken = function() {
    const unhashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");

    const tokenExpiry = Date.now() + 20*60*1000 // 20 mins

    return {unhashedToken, hashedToken, tokenExpiry}
}

export const User = mongoose.model("User", userSchema);