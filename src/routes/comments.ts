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

function saveComments(data: any) {
  writeFileSync(COMMENTS_PATH, JSON.stringify(data, null, 2));
}

// GET /api/comments/:slideId
router.get("/:slideId", (req, res) => {
  const slideId = Number(req.params.slideId);
  const comments = loadComments().filter((c: any) => c.slideId === slideId);
  res.json(comments);
});

// POST /api/comments/:slideId
router.post("/:slideId", (req, res) => {
  const slideId = Number(req.params.slideId);
  const { text, userId, user = "Anon" } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  const comments = loadComments();

  const newComment = {
    id: Date.now(),
    slideId,
    userId,
    user,
    text,
    created_at: new Date().toISOString(),
  };

  comments.push(newComment);
  saveComments(comments);

  res.json(newComment);
});

// DELETE /api/comments/:slideId/:commentId
router.delete("/:slideId/:commentId", (req, res) => {
  const slideId = Number(req.params.slideId);
  const commentId = Number(req.params.commentId);

  let comments = loadComments();
  const before = comments.length;

  comments = comments.filter(
    (c: any) => !(c.slideId === slideId && c.id === commentId)
  );

  if (comments.length === before) {
    return res.status(404).json({ error: "Comment not found" });
  }

  saveComments(comments);

  res.json({ success: true });
});

export default router;
