import { Router, Request, Response } from "express";
// @ts-ignore
import pkg from 'jsonwebtoken';
const { sign } = pkg;

const router = Router();
const SECRET = "supersecret123";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

let users: User[] = [];
let nextId = 1;

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

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  try {
    // Izmantojam 'sign' pa tiešo no 'pkg'
    const token = sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: "Error generating token" });
  }
});

export default router;