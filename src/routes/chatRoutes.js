import express from "express"
import {accessChat,addToGroup,createGroupChat, fetchChats,renameGroup,removeFromGroup} from "../controllers/chatControllers.js"
import authmiddleware from "../middlewares/authMiddleware.js"

const router = express.Router();

router.route("/").post(authmiddleware, accessChat);
router.route("/").get(authmiddleware, fetchChats);
router.route("/group").post(authmiddleware, createGroupChat);
router.route("/groupadd").put(authmiddleware, addToGroup);
router.route("/rename").put(authmiddleware, renameGroup);
router.route("/groupremove").put(authmiddleware, removeFromGroup);




export default router