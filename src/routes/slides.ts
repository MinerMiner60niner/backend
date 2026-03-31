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
  likes?: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const slidesData: Slide[] = JSON.parse(
  readFileSync(path.join(__dirname, "../../src/data/slides.json"), "utf8")
);

// Pagaidu glabātuve laikiem (kamēr nav DB)
let likesStore: Record<number, number> = {}; 

const router = Router();

// Maršruts, lai ielādētu like skaitu
router.get("/:id/likes", (req, res) => {
  const id = Number(req.params.id);
  res.json({ likes: likesStore[id] || 0, userHasLiked: false });
});

// Maršruts, lai nospieztu like
router.post("/:id/like", (req, res) => {
  const id = Number(req.params.id);
  likesStore[id] = (likesStore[id] || 0) + 1;
  res.json({ success: true, likes: likesStore[id] });
});

router.get("/", (req, res) => {
  const slidesWithUrls = slidesData.map((slide) => ({
    ...slide,
    likes: likesStore[slide.id] || 0,
    imageUrl: `/images/${slide.imageFile}`
  }));
  res.json(slidesWithUrls);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const slide = slidesData.find((s) => s.id === id);
  if (!slide) return res.status(404).json({ error: "Slide not found" });

  res.json({
    ...slide,
    likes: likesStore[id] || 0,
    imageUrl: `/images/${slide.imageFile}`
  });
});

export default router;