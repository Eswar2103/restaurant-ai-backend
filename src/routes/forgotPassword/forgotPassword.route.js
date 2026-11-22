import express from "express";
import { forgotPassword } from "./forgotPassword.controller.js";

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post("/", forgotPassword);

export { forgotPasswordRouter };
