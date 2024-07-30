import { log } from "console";
import chatSchema from "../models/chatModel";
import userSchema from '../models/userModel';
import { Request, Response } from 'express';
import { request } from "http";

export const accessChat = async(req:Request,res:Response)=>{
    const userId=req.body.userId;
    console.log('inside chat');
    //console.log('inside chat',req.body);
    console.log('inside chat userId',userId);
   console.log('inside chat user._Id',req.body.user);
    let isChat = await chatSchema.find({
        isGroupChat:false,
        $and:[
            { users: { $elemMatch: { $eq: req.body.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
        ]
    })
    .populate("users", "-password")
    .populate("latestMessage")
    console.log("ischat found?",isChat)
    
    //@ts-ignore
     isChat = await userSchema.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });

      if(isChat.length>0){
        res.send(isChat[0]);
      }else{
        console.log("chat not  found");
        
        var newChat= {
            chatName: "sender",
            isGroupChat:false,
            // user:[req.body.user._id,userId]
            users:[req.body.user._id,userId]
        }
        console.log("chat created",newChat);
        
        try {
            console.log("createdChat before",newChat);

            const createdChat= await chatSchema.create(newChat);
            console.log("createdChat",createdChat);
            
            
            const fullChat = await chatSchema.findOne({_id:createdChat._id}).populate(
                "users","name email pic _id"
            )
            res.status(200).send(fullChat);
        } catch (error:any) {
            res.status(400);
            throw new Error(error.message);
            
        }

      }

      

}
///fetct all chat
export const fetchAllChat = async(req:Request,res:Response)=>{
  const userId=req.body.user._id;
  console.log("inside api",userId);
  
  const chats = await chatSchema.find(
    { users: { $elemMatch: { $eq: req.body.user._id } } }
  ).populate( "latestMessage","content").populate("users", "name");
  if(chats.length>0){
    console.log("chats found");
     chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    res.send(chats)
  }else{
    res.send({message:"not found"})
  }
}
export const updateChat = async(req:Request,res:Response)=>{
  const {message} =req.body;
  console.log(message);
  try {
  const chat=message.chat
  const updatedChat = await chatSchema.findOneAndUpdate(chat,{$set:{latestMessage:message}})
  res.send(updatedChat);
  } catch (error) {
    res.send(error);
  }
}

// export const chatDetails =async(req: Request, res: Response)=>{
//   const chatId=req.body;

//     const chat = await chatSchema.find({_id:"668d304f1deaea4f02b4936a"}).populate("users")
//     console.log(chat);
    
//     res.send(chat);
// }
export const chatDetails = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: "chatId is required" });
    }

    const chat = await chatSchema.findById(chatId).populate("users");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    console.log(chat);
    res.send(chat);
  } catch (error) {
    console.error("Error fetching chat details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
