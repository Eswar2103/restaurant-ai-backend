import express from "express";
import { signup } from "./signup.controller.js";

const signupRoute = express.Router();

signupRoute.post("/", signup);

export { signupRoute };
