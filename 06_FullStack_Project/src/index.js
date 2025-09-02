import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import cors from "cors"

dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.BASE_URL,
  allowedHeaders: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get("/", (req, res) => {
    res.json({
        success: "true"
    })
})

connectDB()
    .then(
        app.listen(PORT, () => {
            console.log(`app is listening on port: ${PORT}`);
        })
    )
