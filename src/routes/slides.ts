import { Router } from "express";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

type Slide = {
  id: number;
  imageFile: string;
  title: string;
  lines: { jp: string; lv: string; en: string }[];
};

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const slidesData: Slide[] = JSON.parse(
  readFileSync(path.join(__dirname, "../../src/data/slides.json"), "utf8")
);

// In-memory likes
let likesStore: Record<number, number> = {};

// GET all slides
router.get("/", (req, res) => {
  const slides = slidesData.map((slide) => ({
    ...slide,
    likes: likesStore[slide.id] || 0,
    imageUrl: `/images/${slide.imageFile}`,
  }));
  res.json(slides);
});

// GET slide by ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const slide = slidesData.find((s) => s.id === id);

  if (!slide) return res.status(404).json({ error: "Slide not found" });

  res.json({
    ...slide,
    likes: likesStore[id] || 0,
    imageUrl: `/images/${slide.imageFile}`,
  });
});

// GET likes
router.get("/:id/likes", (req, res) => {
  const id = Number(req.params.id);
  res.json({ likes: likesStore[id] || 0, userHasLiked: false });
});

// POST like
router.post("/:id/like", (req, res) => {
  const id = Number(req.params.id);
  likesStore[id] = (likesStore[id] || 0) + 1;
  res.json({ success: true, likes: likesStore[id] });
});

export default router;
