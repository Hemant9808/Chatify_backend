import { fetchMessages, sendMessage } from "../controllers/messageController";
import { isAuth } from "../middleware/auth";

const express = require("express");

const router = express.Router();
 router.route("/sendMessage").post(isAuth,sendMessage)
 router.route("/fetchMessages").post(isAuth,fetchMessages)
 export default router;
