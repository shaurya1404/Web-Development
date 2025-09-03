import asyncHandler from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api_errors.js";
import { ApiResponse } from "../utils/api_response.js";
import crypto from 'crypto';
import { sendMailWithMailgen, emailVerificationMailgenContentGenerator, resendEmailVerificationMailgenContentGenerator } from "../utils/mail.js";
import jwtToken from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
    const {email, fullname, username, password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new ApiError(422, "User already exists");
    }

    const newUser = await User.create({
        email,
        fullname,
        username,
        password,
    })

    if(!newUser) {
        throw new ApiError(500, "Error in creating new user")
    }

    const token = crypto.randomBytes(32).toString('hex');
    console.log(token);
    newUser.emailVerificationToken = token;
    await newUser.save();

    const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${token}`
    console.log(verificationUrl);

    await sendMailWithMailgen({
        email: newUser.email,
        subject: "Welcome to Our App!",
        mailGenContent: emailVerificationMailgenContentGenerator(fullname, verificationUrl) 
    })

    return res
        .status(200)
        .json(new ApiResponse(200, "User created successfully. Please check your inbox to verify your account!"))
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({email});                      

    if(!user) {
        throw new ApiError(422, "Incorrect email ID or password");
    }

    const isMatched = await user.isPasswordCorrect(password);

    if(!isMatched) {
        throw new ApiError(422, "Incorrect email ID or password");
    }

    const token = jwtToken.sign({id: user._id}, process.env.JWT_SECRETKEY);
    console.log(token);

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        maxAge: 24*60*60*1000 // 24hrs
    }

    res.cookie("token", token, cookieOptions);

    return res
        .status(200)
        .json(new ApiResponse(200, {id: user.id, email: user.email}))
});

const verifyEmail = asyncHandler(async (req, res) => {

    const { token } = req.params;
    if(!token) {
        throw new ApiError(422, "Token is invalid")
    }

    const user = await User.findOne({emailVerificationToken: token});
    if(!user) {
        throw new ApiError (422, "Cannot find user based on given token");
    }

    if(user.isEmailVerified) {

    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {email: user.email, isVerified: user.isEmailVerified}, "User is verified!"));
});

const resendEmailVerification = asyncHandler(async (req, res) => {

    const { email } = req.user;
    console.log(email);
    const existingUser = await User.findOne({email});
    if(!existingUser) {
        throw new ApiError(422, "Error in finding user")
    }

    const token = crypto.randomBytes(32).toString('hex');
    existingUser.emailVerificationToken = token;
    await existingUser.save();

    const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;

    sendMailWithMailgen({
        email: existingUser.email,
        subject: "New Verification Link",
        mailGenContent: resendEmailVerificationMailgenContentGenerator(existingUser.fullname, verificationUrl)
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {email: existingUser.email}, "New email verification link sent successfully"))
})

const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { _id } = req.user;

    const existingUser = await User.findOne({_id})

    if(!existingUser) {
        throw new ApiError(422, "User does not exist");
    }

    existingUser.password = password;
    await existingUser.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Password changed successfully!"));
})

const logout = asyncHandler(async (req, res) => {
    res.cookie('token', undefined, {});
    return res  
        .status(200)
        .json(new ApiResponse(200, "User successfully logged out"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const currentUser  = req.user;
    return res 
        .status(200)
        .json(new ApiResponse(200, currentUser))
})

export { registerUser, loginUser, verifyEmail, resendEmailVerification, resetForgottenPassword, logout, getCurrentUser }