import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: "Required fields are missing"
        })
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(existingUser) {
            res.status(400).json({
            success: false,
            message: "User exists already"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await prisma.user.create({
            data: {name,
            email, 
            password: hashedPassword,
            verificationToken}
        })

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
            subject: "Verify Your Email",
            text: `Please click on the following link to verify your account:
            ${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}`
        }
        await transporter.sendMail(mailOption);

        return res.status(200).json({
            success: true,
            message: "Registration successfull"
        })

    }

    catch(error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Registration failed"
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400).json({
            success: false,
            message: "Required fields are missing"
        })
    }

    try {
        const user = await prisma.user.findUnique({
        where: {
            email
        }
        })

        if(!user) {
            res.status(400).json({
                success: false,
                message: "Username or password is incorrect"
            })
        }
        const isMatched = bcrypt.compare(user.password, password);

        if(!isMatched) {
            res.status(400).json({
                success: false,
                message: "Username or password is incorrect"
            })
        }

        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_KEY,
            {expiresIn: '24h'}
        )

        const cookieOptions = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful"
        })
    }

    catch(error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Registration failed"
        })
    }
}

export { registerUser, loginUser }