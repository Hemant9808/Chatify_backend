import mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema = new Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"Client"},
    content:{type:String,trim:true},
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"Chat"},
    readBy:[{type:mongoose.Schema.Types.ObjectId,ref:'Client'}]

},
{timestamps:true}
)
export default mongoose.model("Message",messageSchema)