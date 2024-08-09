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
exports.isAuth = void 0;
const jwt = require('jsonwebtoken');
const clientModel_1 = __importDefault(require("../models/clientModel"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('enterd');
    var _a, _b, _c, _d, _e, _f;
    let token;
    if (((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) && ((_c = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization) === null || _c === void 0 ? void 0 : _c.startsWith('Bearer'))) {
        console.log('req.headers?.authorization', (_d = req.headers) === null || _d === void 0 ? void 0 : _d.authorization);
        try {
            token = (_f = (_e = req.headers) === null || _e === void 0 ? void 0 : _e.authorization) === null || _f === void 0 ? void 0 : _f.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(token);
            req.body.user = yield clientModel_1.default.findById(decoded.id).select("-password");
            // console.log(req.body.user);
            next();
        }
        catch (error) {
            res.status(400).send({ message: "token not found" });
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});
exports.isAuth = isAuth;
