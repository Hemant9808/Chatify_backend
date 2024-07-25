

import { forgotPassword } from "../controllers/authController";
import { accessChat, chatDetails, fetchAllChat, updateChat } from "../controllers/chatController";
import { isAuth } from "../middleware/auth";

const express = require("express");

const router = express.Router();

router.route("/accessChat").post(isAuth, accessChat);
router.route("/fetchAllChat").post(isAuth, fetchAllChat);
router.route("/updateChat").post(updateChat);
router.route("/chatDetails").post(chatDetails);


export default router;