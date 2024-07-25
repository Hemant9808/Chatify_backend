
import { log } from 'console';
import user  from '../models/userModel';
import { Document, Schema, model } from 'mongoose';

import { Request, Response } from 'express';
import generateToken from '../config/generateToken';
const bcrypt = require('bcrypt');
import crypto from 'crypto';
const nodemailer= require('nodemailer')
export const userRegister= async (req: Request, res: Response,)=>{
   try {const { name, email, password } = req.body;
   
   const hashedPassword = await bcrypt.hash(password, 10);
   console.log(name,email,hashedPassword);
    const newUser = new user({
        name,
        email,
        password:hashedPassword,
        
      });

      const createdUser = await newUser.save();
      console.log(createdUser._id);


    res.status(201).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        pic: createdUser.pic,
        isAdmin: createdUser.isAdmin,
        token:generateToken(createdUser._id),
      });}
      catch (error) {
        res.status(500).json({ message: 'Server Error', error});
      }
      


}

export const login= async (req: Request, res: Response,)=>{

    try {const { email, password } = req.body;
    console.log(email,password);
      const foundUser = await user.find({email})
      if(user){
        const validpassword = await bcrypt.compare(password, foundUser[0].password);
        if(validpassword){
        res.status(200).json({
            user,
            token:generateToken(foundUser[0]._id),
           });}
           if(!validpassword){
            res.status(200).json({message:"incorrect password"});}
      }
      if(!user){
        res.status(500).json({message:"user doesnt exists"});
      }

    }
       catch (error) {
         res.status(500).json({ message: 'Server Error', error});
       }

}
export const forgotPassowrd= async (req: Request, res: Response,)=>{
  console.log(req.body);
  
  try {
  
  const email =req.body;
  console.log(email.email);
  const foundUser = await user.findOne(email)
  if (!foundUser) {
    return res.status(404).json({ message: 'User does not exist' });
  }
  
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // user.resetPasswordToken=resetToken;
     const newuser = await foundUser.save()
     console.log(newuser)
    
     
    
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
    transporter.sendMail(mailOptions, (error:any, response:any) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error });
      }
      console.log('Email sent:', response);
      res.status(200).json({ message: 'Recovery email sent' });
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
   

  
  return res.status(200).json(user);

  
}
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const foundUser = await user.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!foundUser) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    foundUser.password = hashedPassword;

    // updating resettoken in db in userSchema
    
    // foundUser.resetPasswordToken = undefined;
    // foundUser.resetPasswordExpires = undefined;

    await foundUser.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

