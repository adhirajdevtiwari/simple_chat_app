import mongoose from "mongoose";

const sessionSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    refreshToken:{
        type:String,
        required:true,
    },
    ip:{
        type:String,
        required:true,
    },
    userAgent:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    expiresAt:{
        type:Date,
        required:true,
        expires: 0
    },
    revoked:{
        type:Boolean,
        default:false,
    }
}, {timestamps:true})

const sessionModel=mongoose.model("session",sessionSchema);
export default sessionModel;