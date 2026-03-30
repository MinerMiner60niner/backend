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
// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve images correctly on Render
app.use("/images", express.static(path.join(__dirname, "../images")));
// API routes
app.use("/api/auth", authRouter); // register + login
app.use("/api/slides", slidesRouter); // slides list + slide by id
app.use("/api/slides", commentsRouter); // comments for slides
// Render provides PORT in environment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ADOAPI backend running on port ${PORT}`);
});
