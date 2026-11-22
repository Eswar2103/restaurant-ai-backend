import type { Request, Response, NextFunction } from "express";
import CONSTANTS from "../constants/constants.ts";

interface SignUpMiddlewareType {
  email: string;
  password: string;
  name: string;
  role: string;
}

type LoginMiddlwareType = Pick<SignUpMiddlewareType, "email" | "password">;

interface ChangePasswordMiddlewareType {
  password: string;
  newPassword: string;
}

function signUpMiddleware(req: Request, res: Response, next: NextFunction) {
  const { email, password, name, role }: SignUpMiddlewareType = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: "Missing required feilds" });
  }
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    typeof role !== "string"
  ) {
    return res.status(400).json({ error: "Invalid feilds" });
  }
  if (["reviewer", "owner"].includes(role) === false) {
    return res.status(400).json({ error: "Invalid role" });
  }
  if (
    !CONSTANTS.emailRegex.test(email) ||
    !CONSTANTS.passwordRegex.test(password)
  ) {
    return res.status(400).json({
      success: false,
      error: "Please check the email and password format",
    });
  }
  next();
}

function loginMiddleware(req: Request, res: Response, next: NextFunction) {
  const { email, password }: LoginMiddlwareType = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required feilds" });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid feilds" });
  }

  if (
    !CONSTANTS.emailRegex.test(email)
    // !CONSTANTS.passwordRegex.test(password)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please check the email and password format",
    });
  }
  next();
}

function changePasswordMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { password, newPassword }: ChangePasswordMiddlewareType = req.body;
  if (!password || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Password and newPassword should not be empty",
    });
  }

  if (CONSTANTS.passwordRegex.test(newPassword) === false) {
    return res.status(400).json({
      success: false,
      error:
        "Password doesn't meet the requirements. Please choose strong password.",
    });
  }

  if (password === newPassword) {
    return res.status(400).json({
      success: false,
      error: "Old password and new Password cannot be same.",
    });
  }
  next();
}

export { signUpMiddleware, loginMiddleware, changePasswordMiddleware };
