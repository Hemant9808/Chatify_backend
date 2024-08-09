import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { forgotPassword, login, userRegister,resetPassword, userSearch } from './controllers/authController';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { isAuth } from './middleware/auth';
import chatRoutes from './routes/chatRoutes'
import messageRoute from './routes/messageRoute'
import Client from './models/clientModel';
const { Server } = require('socket.io');

const cors = require('cors');
const app = express();
app.use(express.json());
dotenv.config();
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
const MONGO_URI ="mongodb://127.0.0.1:27017/myApp" 
//const MONGO_URI ="mongodb+srv://hemant9808:ySEEecsHJArJfzfA@mydb.ovbqzxf.mongodb.net/mydb'"
//const MONGO_URI="mongodb+srv://hemant9808:ySEEecsHJArJfzfA@mydb.ovbqzxf.mongodb.net/chatApp";
//const connect = mongoose.connect({process.env.MONGO_URI}).then(()=>{
  const connect = mongoose.connect(MONGO_URI)
  .then(() => {
  console.log("db connected");
}
).catch((error)=>{
  console.log("db connection error:", error);
}

)

app.post('/',  async (req: Request, res: Response) =>{
    
  const {userId} = req.body;

  console.log(userId)
  
  const user = await Client.find({_id:userId})
  if(user){
    res.send(user);
  }else{
    res.status(400).send("not found");
  }

});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', userRegister);
app.post('/login', login);
app.get('/userSearch',userSearch);
app.post('/forgotPassword',forgotPassword);
app.post('/resetPassword/:token', resetPassword);
app.post('/isAuth', isAuth);
//app.post('/accessChat',accessChat)

app.use('/chat',chatRoutes);
app.use('/',messageRoute);

const PORT = 3000;
const server = app.listen(PORT || 3000, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
const io = require('socket.io')(
  server,{
    pingTimeout:6000,
    cors: {
      origin: "http://localhost:5173",
      // credentials: true,
    },
  }
);

io.on("connection",(socket:any)=>{
   console.log('connected to socket...........');
   socket.on("setup",(userData:any)=>{
   // const userData = JSON.parse(user)
   if(userData){
    console.log("setup",userData._id);
    }
    if (userData && userData._id) {
      socket.join(userData._id);
      // socket.in(userData._id).emit("message received",'ksxk')
      socket.emit('connected');
  } else {
      console.error("Invalid userData received:", userData);
  }
             
   });
   socket.on("join chat",(room:string)=>{
    socket.join(room);
    console.log("User Joined Room: " + room);
   });
   socket.on("new message",(newMessageRecieved:any)=>{
    var chat = newMessageRecieved.chat;
    //if (!chat.users) return console.log("chat.users not defined");
    console.log("newMessageRecieved",newMessageRecieved);
    
     chat.users.forEach((user:any)=>{
      // console.log("user",user);
      // socket.in(user).emit("message received",newMessageRecieved)
      // if(user != newMessageRecieved.sender._id){
        if (user != newMessageRecieved.sender._id) {
      socket.in(user).emit("message received",newMessageRecieved)
      console.log("entered new message socket")
    //}
    }
    }
     )
     })
     
})
