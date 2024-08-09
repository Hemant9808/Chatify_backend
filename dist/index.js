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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authController_1 = require("./controllers/authController");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./middleware/auth");
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const messageRoute_1 = __importDefault(require("./routes/messageRoute"));
const clientModel_1 = __importDefault(require("./models/clientModel"));
const { Server } = require('socket.io');
const cors = require('cors');
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
//const port = 3000;
//console.log( process.env.MONGO_URI);
//const MONGO_URI=process.env.MONGO_URI as string
//const MONGO_URI = "mongodb+srv://hemant9808:hemant%409808@chat-app.vyc7226.mongodb.net/chat"
const MONGO_URI = "mongodb://127.0.0.1:27017/myApp";
//const MONGO_URI ="mongodb+srv://hemant9808:ySEEecsHJArJfzfA@mydb.ovbqzxf.mongodb.net/mydb'"
//const MONGO_URI="mongodb+srv://hemant9808:ySEEecsHJArJfzfA@mydb.ovbqzxf.mongodb.net/chatApp";
//const connect = mongoose.connect({process.env.MONGO_URI}).then(()=>{
const connect = mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log("db connected");
}).catch((error) => {
    console.log("db connection error:", error);
});
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    console.log(userId);
    const user = yield clientModel_1.default.find({ _id: userId });
    if (user) {
        res.send(user);
    }
    else {
        res.status(400).send("not found");
    }
}));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.post('/register', authController_1.userRegister);
app.post('/login', authController_1.login);
app.get('/userSearch', authController_1.userSearch);
app.post('/forgotPassword', authController_1.forgotPassword);
app.post('/resetPassword/:token', authController_1.resetPassword);
app.post('/isAuth', auth_1.isAuth);
//app.post('/accessChat',accessChat)
app.use('/chat', chatRoutes_1.default);
app.use('/', messageRoute_1.default);
const PORT = 3000;
const server = app.listen(PORT || 3000, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
const io = require('socket.io')(server, {
    pingTimeout: 6000,
    cors: {
        origin: "http://localhost:5173",
        // credentials: true,
    },
});
io.on("connection", (socket) => {
    console.log('connected to socket...........');
    socket.on("setup", (userData) => {
        // const userData = JSON.parse(user)
        if (userData) {
            console.log("setup", userData._id);
        }
        if (userData && userData._id) {
            socket.join(userData._id);
            // socket.in(userData._id).emit("message received",'ksxk')
            socket.emit('connected');
        }
        else {
            console.error("Invalid userData received:", userData);
        }
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        //if (!chat.users) return console.log("chat.users not defined");
        console.log("newMessageRecieved", newMessageRecieved);
        chat.users.forEach((user) => {
            // console.log("user",user);
            // socket.in(user).emit("message received",newMessageRecieved)
            // if(user != newMessageRecieved.sender._id){
            if (user != newMessageRecieved.sender._id) {
                socket.in(user).emit("message received", newMessageRecieved);
                console.log("entered new message socket");
                //}
            }
        });
    });
});
