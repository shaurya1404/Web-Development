import User from "../model/user_model.js";
import crypto from "crypto";
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { now } from "mongoose";

const registerUser = async (req, res) => {
    // get data 
    // validate data
    // check if user already exists
    // create user in db
    // generate verification token
    // save verification token in db
    // send verification token to user via email
    // send success status to user

    const {name, email, password} = req.body
    if(!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }
    console.log(req.body);

    try { // always use try-catch when dealing with database
        const existingUser = await User.findOne({email})
        if(existingUser) {
            res.status(400).json({
                status:false,
                message: "User already exists!"
            })
        }
        const newUser = await User.create({
            name,
            email,
            password
        })
        if(!newUser) {
            res.status(400).json({
                success: false,
                message: "Error in creating user!"
            })
        }

        const token = crypto.randomBytes(32).toString("hex");
        console.log(token);
        newUser.verificationToken = token;

        await newUser.save();

        // send email using nodemailer and mailtrap
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, 
            auth: {
              user: process.env.MAILTRAP_USERNAME,
              pass: process.env.MAILTRAP_PASSWORD,
            },
          });

        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: newUser.email,
            subject: "Verify Your Email",
            text: `Please click on the following link to verify your account:
            ${process.env.BASE_URL}/api/v1/users/verify/${token}`
        }
        await transporter.sendMail(mailOption);

        res.status(200).json({
            success: true,
            message: "User registered and verified successfully"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "User not registered",
            error
          })
    }
}

const verifyUser = async (req, res) => {
    // get token from url
    // find user based on token
    // set isVerified to true
    // remove verification token
    // return success message 

    try {
        const { token } = req.params;
        if(!token) {
        return res.status(400).json({
            success: false,
            message: "Invalid token"
        })
        }
        const user = await User.findOne({verificationToken: token});
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Cannot find user based on token"
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User verified successfully"
        });
    }
    catch(error) {
        return res.status(400).json({
            success: false,
            message: "Error in verifying user",
            error: error
        });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400).json({
            success: false,
            message: "Email and password are required"
        })
    }

    try {
        const user = await User.findOne({email});

        if(!user) {
            res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "24h"});

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24*60*60
        }
        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        })
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: "Could not log in user",
            error
        })
    }
}

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(400).json({
                success: false,
                message: "user does not exist"
            })
        }
        res.status(200).json({
            success: true,
            message: "Profile success"
        })
    }
    catch(error) {
        
    }
}

const logoutUser = async (req, res) => {
    res.cookie('token', undefined, {});
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    })
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({email})
        if(!user) {
            res.status(400).json({
            success: true,
            message: "User not found"
            })
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + (24 * 60 * 60 * 1000);
        console.log(token);
        user.resetPasswordToken = token;
        user.resetPasswordExpiry = expiry;

        await user.save();

        // send email using nodemailer and mailtrap
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, 
            auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: user.email,
            subject: "Reset Your Password",
            text: `Please click on the following link to reset your password:
            ${process.env.BASE_URL}/api/v1/users/reset/${token}`
        }
        await transporter.sendMail(mailOption);

        res.status(200).json({
            success: true,
            message: "Check your email inbox for reset password link"
        })
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: "Unable to reset your password"
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: {$gt: Date.now()}
            },
        )
        if(!user) {
            res.status(400).json({
                success: true,
                message: "User not found or token expired"
                })
        }
        
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: "Error in changing password"
        })
    }
}

export { registerUser, verifyUser, loginUser, profile, logoutUser, forgotPassword, resetPassword }