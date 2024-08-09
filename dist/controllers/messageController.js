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
exports.fetchMessages = exports.sendMessage = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        var savedMessage = yield messageModel_1.default.create(message);
        const populatedMessage = yield messageModel_1.default.findById(savedMessage._id)
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
        const updatedChat = yield chatModel_1.default
            .findByIdAndUpdate(req.body.chatId, { latestMessage: savedMessage })
            .populate("latestMessage", "content sender");
        res.status(200).send(populatedMessage);
    }
    catch (error) {
        res.status(201).send({ message: error });
    }
});
exports.sendMessage = sendMessage;
const fetchMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.body;
        const messages = yield messageModel_1.default
            .find({ chat: chatId })
            .populate("sender", "name email pic _id")
            .populate("chat", "chat._id users")
            .lean();
        if (messages.length > 0) {
            res.status(200).json(messages);
        }
        else {
            res.status(200).json(messages);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.fetchMessages = fetchMessages;
