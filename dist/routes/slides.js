import { Router } from "express";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load JSON from the *source* folder, not dist
const slidesData = JSON.parse(readFileSync(path.join(__dirname, "../../src/data/slides.json"), "utf8"));
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
