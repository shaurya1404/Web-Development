import { prismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import jwt from "jsonwebtoken";

const prisma = new prismaClient();

export const registerUser = async (req, res) => {
    // extract data from body
    const { name, email, password, phone } = req.body;

    // ensure nothing is missing
    if(!name || !email || !password || !phone) {
        console.log("Data is missing");
        res.status.json({
            success: false,
            message: "all fields are required"
        })
    }
    try{
        // check if user already exists in db
        const existingUser = await prisma.user.findUnique({
            where: {email}
        })
        if(existingUser) {
            return res.status(400).json({
                message: "User alreayd exists",
                success: false
            })
        }
        // hash the password before storing db
        const hashedPassword = bcrypt.hash(password, 10);

        //sending verification token (randomly generated string)
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // creating the user in db
        const user = await prisma.user.create({
            data: {
                name,
                email, 
                password: hashedPassword,
                phone,
                verificationToken
            }
        })


    }
    catch(error) {
        console.log(error);
        res.status(400).json({
            message: "Error in registering user",
            success: false
        })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        })
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatched = bcrypt.compare(password, user.password)
        if(!isMatched) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            })
        }
        // creating a JWT token that stires the user's session
        const JWTtoken = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        )

        //migrating the JWTtoken via cookies
        const cookieOptions = {
            httpOnly: true
        }
        res.cookie('token', JWTtoken), cookieOptions;

        return res.status(201).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    }
    catch(error) {
        return res.status(400).json({
            success: false,
            message: "Error in logging in user",
        })
    }
}