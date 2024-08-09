"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageController_1 = require("../controllers/messageController");
const auth_1 = require("../middleware/auth");
const express = require("express");
const router = express.Router();
router.route("/sendMessage").post(auth_1.isAuth, messageController_1.sendMessage);
router.route("/fetchMessages").post(auth_1.isAuth, messageController_1.fetchMessages);
exports.default = router;
