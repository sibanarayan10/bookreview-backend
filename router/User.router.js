import { Router } from "express";
import { loginUser, signUp } from "../controllers/User.controller.js";

const router = Router();
router.route("/signup").post(signUp);
router.route("/login").post(loginUser);
export default router;
