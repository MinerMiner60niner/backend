import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMMENTS_PATH = path.join(__dirname, "../../src/data/comments.json");
function loadComments() {
    return JSON.parse(readFileSync(COMMENTS_PATH, "utf8"));
}
function saveComments(data) {
    writeFileSync(COMMENTS_PATH, JSON.stringify(data, null, 2));
}
// GET /api/slides/:id/comments
router.get("/:id/comments", (req, res) => {
    const slideId = Number(req.params.id);
    const comments = loadComments().filter((c) => c.slideId === slideId);
    res.json(comments);
});
// POST /api/slides/:id/comments
router.post("/:id/comments", (req, res) => {
    const slideId = Number(req.params.id);
    const { text, user = "Anon" } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Missing text" });
    }
    const comments = loadComments();
    const newComment = {
        id: Date.now(),
        slideId,
        user,
        text
    };
    comments.push(newComment);
    saveComments(comments);
    res.json({ success: true, comment: newComment });
});
// DELETE /api/slides/:id/comments/:commentId
router.delete("/:id/comments/:commentId", (req, res) => {
    const slideId = Number(req.params.id);
    const commentId = Number(req.params.commentId);
    let comments = loadComments();
    const before = comments.length;
    comments = comments.filter((c) => !(c.slideId === slideId && c.id === commentId));
    if (comments.length === before) {
        return res.status(404).json({ error: "Comment not found" });
    }
    saveComments(comments);
    res.json({ success: true });
});
export default router;
