import express from "express";
import cors from "cors";
import slidesRouter from "./routes/slides.js";

const app = express();
app.use(cors());
app.use(express.json());

// Serve images folder
app.use("/images", express.static("images"));

// API routes
app.use("/api/slides", slidesRouter);

// Render provides PORT in environment
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ADOAPI backend running on port ${PORT}`);
});
