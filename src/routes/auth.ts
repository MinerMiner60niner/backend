import { Router } from "express";

const router = Router();

// Vienkārša "datubāze" atmiņā
let users: { name: string; email: string; password: string }[] = [];

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "User already exists" });
  }

  users.push({ name, email, password });

  res.json({ success: true, message: "Registered successfully" });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    success: true,
    message: "Login successful",
    user: { name: user.name, email: user.email }
  });
});

export default router;
