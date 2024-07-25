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
exports.resetPassword = exports.forgotPassowrd = exports.login = exports.userRegister = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = __importDefault(require("../config/generateToken"));
const bcrypt = require('bcrypt');
const crypto_1 = __importDefault(require("crypto"));
const nodemailer = require('nodemailer');
const userRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = yield bcrypt.hash(password, 10);
        console.log(name, email, hashedPassword);
        const newUser = new userModel_1.default({
            name,
            email,
            password: hashedPassword,
        });
        const createdUser = yield newUser.save();
        console.log(createdUser._id);
        res.status(201).json({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            pic: createdUser.pic,
            isAdmin: createdUser.isAdmin,
            token: (0, generateToken_1.default)(createdUser._id),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.userRegister = userRegister;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const foundUser = yield userModel_1.default.find({ email });
        if (userModel_1.default) {
            const validpassword = yield bcrypt.compare(password, foundUser[0].password);
            if (validpassword) {
                res.status(200).json({
                    user: userModel_1.default,
                    token: (0, generateToken_1.default)(foundUser[0]._id),
                });
            }
            if (!validpassword) {
                res.status(200).json({ message: "incorrect password" });
            }
        }
        if (!userModel_1.default) {
            res.status(500).json({ message: "user doesnt exists" });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.login = login;
const forgotPassowrd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const email = req.body;
        console.log(email.email);
        const foundUser = yield userModel_1.default.findOne(email);
        if (!foundUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        // user.resetPasswordToken=resetToken;
        const newuser = yield foundUser.save();
        console.log(newuser);
        // Set up nodemailer transporter (update with your email service details)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password',
            },
        });
        const mailOptions = {
            to: newuser.email,
            from: 'passwordreset@yourdomain.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };
        transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email', error });
            }
            console.log('Email sent:', response);
            res.status(200).json({ message: 'Recovery email sent' });
        });
    }
    catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Server Error', error });
    }
    return res.status(200).json(userModel_1.default);
});
exports.forgotPassowrd = forgotPassowrd;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const foundUser = yield userModel_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!foundUser) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        foundUser.password = hashedPassword;
        // updating resettoken in db in userSchema
        // foundUser.resetPasswordToken = undefined;
        // foundUser.resetPasswordExpires = undefined;
        yield foundUser.save();
        res.status(200).json({ message: 'Password has been reset' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.resetPassword = resetPassword;
