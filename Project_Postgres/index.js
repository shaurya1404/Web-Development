import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/user_routes';

const port = process.env.PORT || 4000;

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cors({
    origin: process.env.BASE_URL
}))

//custom routes
app.use("/api/v2/users", router);

app.get("/", (req, res) => {
    res.status(200);
})

app.listen(port, () => {
    console.log(`Backend is listening on port: ${port}`);
})