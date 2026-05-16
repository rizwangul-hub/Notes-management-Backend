import express from "express";
import { config } from "dotenv";
import { connnectionDB } from "./src/config/db.js";
import authRouter from "./src/Router/auth.js"
import notesRouter from "./src/Router/notes.js"
import cors from "cors"



config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        process.env.FRONTEND_URL
      ];
      if (!origin || allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
connnectionDB();
app.use("/api/auth", authRouter);
app.use("/api", notesRouter)

app.get("/", (req, res) => {
  res.send("welcome");
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
