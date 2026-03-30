import { Router, Request, Response } from "express";
import { SignJWT } from "jose";

const router = Router();
const SECRET = new TextEncoder().encode("supersecret123");

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
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  
  const newUser: User = { id: nextId++, name, email, password };
  users.push(newUser);
  res.json({ success: true });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Šeit mēs nodefinējam 'user' mainīgo!
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  try {
    const token = await new SignJWT({ id: user.id, name: user.name, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: "Error generating token" });
  }
});

export default router;