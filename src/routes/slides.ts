import { Router } from "express";
import slidesData from "../data/slides.json" assert { type: "json" };

type Slide = {
  id: number;
  imageFile: string;
  title: string;
  lines: { jp: string; lv: string; en: string }[];
  comments: string[];
};

const slides = slidesData as Slide[];

const router = Router();

// Return slides with relative image URLs
router.get("/", (req, res) => {
  const slidesWithUrls = slides.map((slide) => ({
    ...slide,
    imageUrl: `/images/${slide.imageFile}`
  }));

  res.json(slidesWithUrls);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const slide = slides.find((s) => s.id === id);

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
