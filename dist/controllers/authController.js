"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSearch = exports.resetPassword = exports.forgotPassword = exports.login = exports.userRegister = void 0;
const clientModel_1 = __importDefault(require("../models/clientModel"));
const generateToken_1 = __importDefault(require("../config/generateToken"));
const bcrypt = require("bcryptjs");
const crypto_1 = __importDefault(require("crypto"));
const contstants_1 = require("../utils/contstants");
const nodemailer = require("nodemailer");
const userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const foundUser = yield clientModel_1.default.find({ email: email });
        if (foundUser.length > 0) {
            res.send({ message: "This email is already registered" });
        }
        else {
            const hashedPassword = yield bcrypt.hash(password, 10);
            console.log(name, email, hashedPassword);
            const newUser = new clientModel_1.default({
                name,
                email,
                password: hashedPassword,
            });
            const createdUser = yield newUser.save();
            console.log(createdUser._id);
            console.log("still running");
            res.status(201).json({
                _id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                pic: createdUser.pic,
                isAdmin: createdUser.isAdmin,
                success: true,
                token: (0, generateToken_1.default)(createdUser._id),
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.userRegister = userRegister;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("entered");
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const foundUser = yield clientModel_1.default.find({ email: email });
        console.log(foundUser);
        if (foundUser.length < 1) {
            res.status(200).json({ message: "user doesnt exists" });
        }
        if (foundUser) {
            const validpassword = yield bcrypt.compare(password, foundUser[0].password);
            if (!validpassword) {
                res.status(200).json({ message: "incorrect password" });
            }
            if (validpassword) {
                res.status(200).json({
                    foundUser,
                    token: (0, generateToken_1.default)(foundUser[0]._id),
                    message: "logged in successfully",
                    success: true,
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //console.log( "useridfromfrogotpasswrd" ,req.body.user?._id);
        console.log("enterd");
        const { email } = req.body;
        const foundUser = yield clientModel_1.default.findOne({ email });
        console.log("userFound", foundUser);
        if (!foundUser) {
            console.log("usernot fournd");
            return res.status(400).json({ message: "User does not exist" });
        }
        const resetToken = crypto_1.default.randomBytes(20).toString("hex");
        foundUser.resetPasswordToken = resetToken;
        foundUser.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
        const newUser = yield foundUser.save();
        console.log(newUser);
        // Set up nodemailer transporter (update with your email service details)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "hemant@adirayglobal.com",
                pass: "ogmnatcklinhjoyl",
            },
        });
        const mailOptions = {
            from: "hemant@adirayglobal.com",
            to: "hemant27134@gmail.com ",
            //cc: ["lalit@threely.io"],
            subject: "Password Reset",
            // text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            //   Please click on the following link, or paste this into your browser to complete the process:\n\n
            //   http://${req.headers.host}/reset/${resetToken}\n\n
            //   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            html: contstants_1.copyButton,
        };
        //   http://${req.headers.host}/reset/${resetToken}\n\n
        transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Error sending email", error });
            }
            console.log("Email sent:", response);
            res.status(200).json({ message: "Recovery email sent" });
        });
    }
    catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("enter");
    try {
        const token = req.params;
        const { password } = req.body;
        console.log(token);
        const foundUser = yield clientModel_1.default.findOne({
            resetPasswordToken: token,
            //
        });
        if (!foundUser) {
            return res
                .status(400)
                .json({ message: "Password reset token is invalid or has expired" });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        foundUser.password = hashedPassword;
        // updating resettoken in db in userSchema
        // foundUser.resetPasswordToken = undefined;
        // foundUser.resetPasswordExpires = undefined;
        yield foundUser.save();
        res.status(200).json({ message: "Password has been reset" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});
exports.resetPassword = resetPassword;
const userSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.email;
    console.log(query);
    try {
        const response = yield clientModel_1.default.find({
            email: { $regex: query, $options: 'i' } // Case-insensitive regex search on email
        });
        res.send(response);
    }
    catch (error) {
        res.send({ message: error });
    }
});
exports.userSearch = userSearch;
