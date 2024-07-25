import { verify } from 'crypto';
import {NextFunction, Request,Response} from 'express' ;
const jwt = require('jsonwebtoken');
import Client from '../models/clientModel';


export const isAuth =async(req:Request,res:Response,next:NextFunction)=>{
  //console.log('enterd');
      
    let token;
    if(req.headers?.authorization && req.headers?.authorization?.startsWith('Bearer'))
    { console.log('req.headers?.authorization', req.headers?.authorization);
    
    try{

    token=req.headers?.authorization?.split(" ")[1];
    const decoded =  jwt.verify(token,process.env.JWT_SECRET);
      console.log(token);
    req.body.user = await Client.findById(decoded.id).select("-password") 
   // console.log(req.body.user);
    
 next();
}
catch (error) {
    res.status(400).send({message:"token not found"});
    
  }}
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token")
  }
     
}