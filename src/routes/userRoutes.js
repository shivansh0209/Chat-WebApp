import express from "express"
import { allUsers, loginUser, registerUser } from "../controllers/userControllers.js";
import { validationOptions , checkValidationResult } from "../middlewares/validateFieldsMiddleware.js"
import { upload } from "../middlewares/multerMiddleware.js"
import authmiddleware from "../middlewares/authMiddleware.js";

const router=express.Router();

router.route("/").get(authmiddleware, allUsers)
router.route("/").post(upload.single("profile"),validationOptions,checkValidationResult,registerUser);
router.route("/login").post(loginUser)

export default router


