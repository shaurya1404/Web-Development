import express from "express";

//router imports
import healthCheckRouter from "./routes/healthcheck.routes.js";

const app = express();

app.use("/api/v1/healthcheck", healthCheckRouter);

export default app