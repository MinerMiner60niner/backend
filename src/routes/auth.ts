import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const SECRET = "supersecret123";

// Definējam lietotāja interfeisu labākai tipu drošībai
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Vienkārša "datubāze" atmiņā
let users: User[] = [];
let nextId = 1;

// POST /api/auth/register
router.post("/register", (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser: User = { id: nextId++, name, email, password };
  users.push(newUser);

  res.json({ success: true });
});

// POST /api/auth/login
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Izveidojam JWT tokenu
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
  });
});

export default router;