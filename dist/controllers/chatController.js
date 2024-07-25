"use strict";
// import chatSchema from "../models/chatModel";
// import userSchema from '../models/userModel';
// import { Request, Response } from 'express';
// export const accessChat = async(req:Request,res:Response)=>{
//     const userId=req.body;
//     let isChat = await chatSchema.find({
//         isGrouChat:false,
//         $and:[
//             { users: { $elemMatch: { $eq: req.user._id } } },
//       { users: { $elemMatch: { $eq: userId } } },
//         ]
//     }).populate("users", "-password")
//     .populate("latestMessage")
// isChat = await userSchema.populate(isChat, {
//         path: "latestMessage.sender",
//         select: "name pic email",
//       });
//       if(isChat.length>0){
//         res.send(isChat[0]);
//       }else{
//         var newChat= {
//             chatName: "sender",
//             isGroupChat:false,
//             user:[req.user._id,user.id]
//         }
//         try {
//             const createdChat= await chatSchema.create(newChat);
//             const fullChat = await chatSchema.findOne({_id:createdChat._id}).populate(
//                 "users","-password"
//             );
//             res.status(200).send(fullChat);
//         } catch (error) {
//             res.status(400);
//             throw new Error(error.message);
//         }
//       }
// }
