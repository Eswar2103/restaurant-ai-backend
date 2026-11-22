import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { supabase } from "./services/supabase.js";
import { signupRoute } from "./routes/signup/signup.route.js";
import { loginRouter } from "./routes/login/login.route.js";
import { forgotPasswordRouter } from "./routes/forgotPassword/forgotPassword.route.js";
import { changePasswordRouter } from "./routes/changePassword/changePassword.route.js";
import {
  changePasswordMiddleware,
  loginMiddleware,
  signUpMiddleware,
} from "./middlewares/auth.middleware.js";
import {
  userClient,
  authenticate,
} from "./middlewares/userClient.middleware.js";

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(
  express.json({
    limit: "100kb",
  }),
);

app.use("/signup", signUpMiddleware, signupRoute);
app.use("/login", loginMiddleware, loginRouter);
app.use("/forgotPassword", forgotPasswordRouter);
app.use(
  "/changePassword",
  authenticate,
  userClient,
  changePasswordMiddleware,
  changePasswordRouter,
);

export default app;
