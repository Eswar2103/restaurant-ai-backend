import express from "express";
import { login } from "./login.controller.js";

const loginRouter = express.Router();

loginRouter.post("/", login);

export { loginRouter };
