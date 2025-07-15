import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/auth_route.js';

const app = express();
dotenv.config() // If .env is not in the same root folder --> config({path: '/filepath'})

app.use(express.json()); // Server now accepts JSON data
app.use(express.urlencoded({extended: true})); // Server now accepts data from the URL - req.params
app.use(cookieParser());

app.use(cors({
    origin: 'https://localhost:5173'
}))

const port = process.env.PORT || 4000;

// custom routes

app.use('/api/v1/user', userRouter) // app.use() always implies adding a middleware to the server

app.get("/", (req, res) => {
    res.status(200).json({
        status: true
    })
})

app.listen(port, () => {
    console.log(`Backend is listening on port ${port}`);
})

