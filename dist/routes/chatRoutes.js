"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const express = require("express");
const router = express.Router();
router.route("/").post(auth_1.isAuth, authController_1.forgotPassword);
exports.default = router;
