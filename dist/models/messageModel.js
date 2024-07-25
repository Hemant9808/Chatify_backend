"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const messageSchema = new mongoose_2.Schema({
    sender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Client" },
    content: { type: String, trim: true },
    chat: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Client' }]
}, { timestamps: true });
