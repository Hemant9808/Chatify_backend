import mongoose from "mongoose";
const { Schema } = mongoose;


const Client = new Schema(
    {
       name:{
        type : String,
        required:true,
       },
       email:{
        type : String,
        required:true,
       },
       password:{
        type : String,
        required:true,
       },
       pic: {
        type: "String",
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
      resetPasswordToken: {
        type: "String",
     
      
      },
      resetPasswordExpires: { type: Date },

    },
    {
        timestamps: true // Mongoose supports timestamps directly
    }
 );


 export default mongoose.model("Client", Client); 