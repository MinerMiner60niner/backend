import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import slidesRouter from "./routes/slides.js";
import authRouter from "./routes/auth.js";
import commentsRouter from "./routes/comments.js";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve images
app.use("/images", express.static(path.join(__dirname, "../images")));

// REST API routes
app.use("/api/auth", authRouter);
app.use("/api/slides", slidesRouter);
app.use("/api/comments", commentsRouter);

app.get("/", (req, res) => {
  res.send("ADOAPI Backend is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ADOAPI backend running on port ${PORT}`);
});
