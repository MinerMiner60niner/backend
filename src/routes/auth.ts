import { Router, Request, Response } from "express";
import { SignJWT } from "jose";

const router = Router();
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Šeit parasti būtu DB pārbaude. Šobrīd izveidojam testa lietotāju:
    const user = { id: 1, name: "Test User", email: email }; 

    const token = await new SignJWT({ id: user.id, name: user.name, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Servera kļūda" });
  }
});

export default router;