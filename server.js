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
    origin: [process.env.FRONTEND_URL],
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
