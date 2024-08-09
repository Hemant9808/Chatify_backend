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
exports.chatDetails = exports.updateChat = exports.fetchAllChat = exports.accessChat = void 0;
const chatModel_1 = __importDefault(require("../models/chatModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const accessChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    console.log('inside chat');
    if (!req.body.user || !req.body.user._id) {
        return res.status(400).json({ error: "User data is missing or invalid" });
    }
    //console.log('inside chat',req.body);
    console.log('inside chat userId', userId);
    console.log('inside chat user._Id', req.body.user);
    let isChat = yield chatModel_1.default.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.body.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage");
    console.log("ischat found?", isChat);
    //@ts-ignore
    isChat = yield userModel_1.default.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        console.log("chat not  found");
        var newChat = {
            chatName: "sender",
            isGroupChat: false,
            // user:[req.body.user._id,userId]
            users: [req.body.user._id, userId]
        };
        console.log("chat created", newChat);
        try {
            console.log("createdChat before", newChat);
            const createdChat = yield chatModel_1.default.create(newChat);
            console.log("createdChat", createdChat);
            const fullChat = yield chatModel_1.default.findOne({ _id: createdChat._id }).populate("users", "name email pic _id");
            res.status(200).send(fullChat);
        }
        catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});
exports.accessChat = accessChat;
///fetct all chat
const fetchAllChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.user._id;
    console.log("inside api", userId);
    const chats = yield chatModel_1.default.find({ users: { $elemMatch: { $eq: req.body.user._id } } }).populate("latestMessage", "content").populate("users", "name");
    if (chats.length > 0) {
        console.log("chats found");
        chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        res.send(chats);
    }
    else {
        res.send({ message: "not found" });
    }
});
exports.fetchAllChat = fetchAllChat;
const updateChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    console.log(message);
    try {
        const chat = message.chat;
        const updatedChat = yield chatModel_1.default.findOneAndUpdate(chat, { $set: { latestMessage: message } });
        res.send(updatedChat);
    }
    catch (error) {
        res.send(error);
    }
});
exports.updateChat = updateChat;
// export const chatDetails =async(req: Request, res: Response)=>{
//   const chatId=req.body;
//     const chat = await chatSchema.find({_id:"668d304f1deaea4f02b4936a"}).populate("users")
//     console.log(chat);
//     res.send(chat);
// }
const chatDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.body;
        if (!chatId) {
            return res.status(400).json({ error: "chatId is required" });
        }
        const chat = yield chatModel_1.default.findById(chatId).populate("users");
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        console.log(chat);
        res.send(chat);
    }
    catch (error) {
        console.error("Error fetching chat details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.chatDetails = chatDetails;
