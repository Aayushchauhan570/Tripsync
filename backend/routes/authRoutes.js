import signupRoute from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post('/signup', signupRoute);

export default router;
