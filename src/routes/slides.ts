import { Router } from "express";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

type Slide = {
  id: number;
  imageFile: string;
  title: string;
  lines: { jp: string; lv: string; en: string }[];
  comments: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON manually (Render-safe)
const slidesData: Slide[] = JSON.parse(
  readFileSync(path.join(__dirname, "../data/slides.json"), "utf8")
);

const router = Router();

// Return slides with relative image URLs
router.get("/", (req, res) => {
  const slidesWithUrls = slidesData.map((slide) => ({
    ...slide,
    imageUrl: `/images/${slide.imageFile}`
  }));

  res.json(slidesWithUrls);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const slide = slidesData.find((s) => s.id === id);

  if (!slide) {
    return res.status(404).json({ error: "Slide not found" });
  }

  const slideWithUrl = {
    ...slide,
    imageUrl: `/images/${slide.imageFile}`
  };

  res.json(slideWithUrl);
});

export default router;
