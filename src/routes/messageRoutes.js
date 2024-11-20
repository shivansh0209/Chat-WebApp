import express from "express"
import authmiddleware from "../middlewares/authMiddleware.js"
import {sendMessage,allMessages} from "../controllers/messageControllers.js"

const router=express.Router()

router.route("/:chatId").get(authmiddleware, allMessages);
router.route("/").post(authmiddleware, sendMessage);

export default router
