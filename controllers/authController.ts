import { log } from "console";
import Client from "../models/clientModel";

import { Request, Response } from "express";
import generateToken from "../config/generateToken";
const bcrypt = require("bcryptjs");
import crypto from "crypto";
import {
  adminSendOtpTemplate,
  emailOTPVerificationTemplate,
  otp,
  welcomeEmail,
  loginTemplate,
  otp2,
  welcomeNew,
  emailVerification,
  copyButton
} from "../utils/contstants";
const nodemailer = require("nodemailer");

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const foundUser = await Client.find({ email: email });
    if (foundUser.length>0) {
      res.send({ message: "This email is already registered" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(name, email, hashedPassword);
      const newUser = new Client({
        name,
        email,
        password: hashedPassword,
      });

      const createdUser = await newUser.save();
      console.log(createdUser._id);
      console.log("still running");

      res.status(201).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        pic: createdUser.pic,
        isAdmin: createdUser.isAdmin,
        success:true,
        token: generateToken(createdUser._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("entered");

  try {
    const { email, password } = req.body;
    console.log(email, password);

    const foundUser = await Client.find({ email: email });
    console.log(foundUser);
    if (foundUser.length < 1) {
      res.status(200).json({ message: "user doesnt exists" });
    }

    if (foundUser) {
      const validpassword = await bcrypt.compare(
        password,
        foundUser[0].password
      );
      if (!validpassword) {
        res.status(200).json({ message: "incorrect password" });
      }
      if (validpassword) {
        res.status(200).json({
          foundUser,
          token: generateToken(foundUser[0]._id),
          message: "logged in successfully",
          success: true,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    //console.log( "useridfromfrogotpasswrd" ,req.body.user?._id);

    console.log("enterd");

    const { email } = req.body;

    const foundUser = await Client.findOne({ email });
    console.log("userFound", foundUser);

    if (!foundUser) {
      console.log("usernot fournd");
      return res.status(400).json({ message: "User does not exist" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    foundUser.resetPasswordToken = resetToken;
    foundUser.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

    const newUser = await foundUser.save();
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
      html: copyButton,
    };
    //   http://${req.headers.host}/reset/${resetToken}\n\n

    transporter.sendMail(mailOptions, (error: any, response: any) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email", error });
      }
      console.log("Email sent:", response);
      res.status(200).json({ message: "Recovery email sent" });
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  console.log("enter");

  try {
    const token = req.params;
    const { password } = req.body;
    console.log(token);

    const foundUser = await Client.findOne({
      resetPasswordToken: token,
      //
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    foundUser.password = hashedPassword;

    // updating resettoken in db in userSchema

    // foundUser.resetPasswordToken = undefined;
    // foundUser.resetPasswordExpires = undefined;

    await foundUser.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const userSearch = async(req: Request, res: Response)=>{
  const query = req.query.email;
  console.log(query);
  
  try {
    const response = await Client.find({
      email: { $regex: query, $options: 'i' } // Case-insensitive regex search on email
    });
    res.send(response)
    
  } catch (error) {
    res.send({message:error})
  }
 
}
