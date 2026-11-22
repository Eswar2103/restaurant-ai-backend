import express from "express";
import { changePassword } from "./changePassword.controller.js";

const changePasswordRouter = express.Router();

changePasswordRouter.post("/", changePassword);

export { changePasswordRouter };
