import { Router, Request, Response } from "express";
import { SignJWT } from "jose";

const router = Router();
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

// REGISTER
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  // Fake user creation
  const user = { id: Date.now(), name, email };

  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  res.json({ user, token });
});

// LOGIN
router.post("/login", async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = { id: 1, name: "Test User", email };

  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  res.json({ user, token });
});

export default router;
