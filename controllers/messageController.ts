import { Request, Response } from "express";
import messageSchema from "../models/messageModel";
import Client from "../models/clientModel";
import { updateChat } from "./chatController";
import chatSchema from "../models/chatModel";

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, content } = req.body;
  if (!chatId || !content) {
    res.status(400).send("data not found");
  }
  try {
    const message = {
      content: content,
      sender: req.body.user._id,
      chat: chatId,
    };
    var savedMessage = await messageSchema.create(message);
    const populatedMessage = await messageSchema.findById(savedMessage._id)
    .populate("sender", "name email pic _id")
    .populate("chat", "chat._id users")
    .lean();
    //const newMessage=await messageSchema.find({chat:savedMessage.chat}).populate("sender")
    // savedMessage = await savedMessage.populate("sender", "name pic").execPopulate();
    // savedMessage = await savedMessage.populate("chat").execPopulate();
    // savedMessage= await Client.populate(savedMessage, {
    //     path: "chat.users",
    //     select: "name pic email",
    //   });
    const updatedChat = await chatSchema
      .findByIdAndUpdate(req.body.chatId, { latestMessage: savedMessage })
      .populate("latestMessage", "content sender");

    res.status(200).send(populatedMessage);
  } catch (error) {
    res.status(201).send({message:error});
  }
};


export const fetchMessages = async (req: Request, res: Response) => {
    try {
      const { chatId } = req.body;
  
      const messages = await messageSchema
        .find({ chat: chatId })
        .populate("sender", "name email pic _id")
        .populate("chat", "chat._id users")
        .lean();
  
      if (messages.length > 0) {
        res.status(200).json(messages);
      } else {
        res.status(200).json(messages);
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
