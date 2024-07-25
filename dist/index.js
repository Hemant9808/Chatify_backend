"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authController_1 = require("./controllers/authController");
const dotenv_1 = __importDefault(require("dotenv"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const port = 3000;
//const MONGO_URI = process.env.MONGO_URI
const MONGO_URI = "mongodb://127.0.0.1:27017/myApp";
//const MONGO_URI="mongodb+srv://hemant9808:ySEEecsHJArJfzfA@mydb.ovbqzxf.mongodb.net/chatApp";
const connect = mongoose_1.default.connect(MONGO_URI).then(() => {
    console.log("db connected");
}).catch((error) => {
    console.log("db connection error:", error);
});
app.get('/', (req, res) => {
    res.send('Hello, TypeScript!');
});
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.post('/register', authController_1.userRegister);
app.post('/login', authController_1.login);
//app.post('/forgotPassword',forgotPassword);
app.use('/forgotPassword', chatRoutes_1.default);
app.post('/resetPassword/:token', authController_1.resetPassword);
//app.post('/accessChat',accessChat)
app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
