import userModel from "../models/auth.model.js"
import sessionModel from "../models/session.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import crypto from "crypto";



async function register(req,res){
    const {username,email,password}=req.body;
    
    const alreadyExist=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(alreadyExist){
        return res.status(400).json({msg:"username or email already exist"});
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const user=new userModel({
        username,
        email,
        password:hashedPassword,
    })
    
    const refreshToken=jwt.sign({id:user._id},
                                config.JWT_SECRET,
                                {expiresIn:"7d"}
                            );
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session =new sessionModel({
    userId:user._id,
    refreshToken:refreshTokenHash,
    ip:req.ip,
    userAgent:req.headers["user-agent"],
    expiresAt:new Date(Date.now()+7*24*60*60*1000),
    })

    const accessToken=jwt.sign(
        {id:user._id,sessionId:session._id},    
        config.JWT_SECRET,
        {expiresIn:"15m"}
    );
    
    // Actually save them to the database!  
    await user.save();
    await session.save();

    res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:true,sameSite:"strict",maxAge:3600000});

    
    return res.status(201).json({msg:"user registered successfully", user,accessToken,refreshToken});
}

async function login(req,res){
    const {email,password}=req.body;
    const user=await userModel.findOne({email});
    if(!user){
        return res.status(401).json({msg:"invalid email or password"});
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({msg:"invalid email or password"});
    }

    // Limit maximum concurrent sessions (e.g., 5 devices max) to prevent database bloat
    const MAX_SESSIONS = 5;
    const activeSessionsCount = await sessionModel.countDocuments({ userId: user._id });
    if (activeSessionsCount >= MAX_SESSIONS) {
        // Delete the oldest session to make room for the new one
        const oldestSession = await sessionModel.findOne({ userId: user._id }).sort({ createdAt: 1 });
        if (oldestSession) {
            await sessionModel.findByIdAndDelete(oldestSession._id);
        }
    }
    const refreshToken=jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:"7d"});
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session=new sessionModel({
        userId:user._id,
        refreshToken:refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers["user-agent"],
        expiresAt:new Date(Date.now()+7*24*60*60*1000),
    })
    const accessToken=jwt.sign({id:user._id,sessionId:session._id},config.JWT_SECRET,{expiresIn:"15m"});
    await user.save();
    await session.save();
    res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:true,sameSite:"strict",maxAge:3600000});
    return res.status(200).json({msg:"user logged in successfully",user,accessToken,refreshToken});


}
async function getMe(req,res){
   try {
     const refreshToken=req.cookies.refreshToken;

    const decodedToken=jwt.verify(refreshToken,config.JWT_SECRET);
    
    const user=await userModel.findById(decodedToken.id);

    if(!user){
        return res.status(404).json({msg:"user not found"});
    }
    return res.status(200).json({user});
   } 
   catch(e)
    {
        if (e.name === 'JsonWebTokenError') {return res.status(401).json({msg: "invalid token provided"});}
        return res.status(500).json({msg:"internal server error"});
    }
}
async function refreshToken(req,res){
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({msg:"unauthorized"});
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session=await sessionModel.findOne({
        refreshToken:refreshTokenHash,
        
        revoked:false,
    })
    if(!session){
        return res.status(404).json({msg:"session not found"});
    }
    const decodedToken=jwt.verify(refreshToken,config.JWT_SECRET);
    const user=await userModel.findById(decodedToken.id);

    if(!user){
        return res.status(404).json({msg:"user not found"});
    }
    const accessToken=jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:"15m"});
    const newRefreshToken=jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:"7d"});
    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    session.refreshToken=newRefreshTokenHash;
    session.expiresAt=new Date(Date.now()+7*24*60*60*1000);
    await session.save();
    res.cookie("refreshToken",newRefreshToken,{httpOnly:true,secure:true,sameSite:"strict",maxAge:3600000});
    return res.status(200).json({msg:"token refreshed successfully",accessToken,newRefreshToken});
}


async function logout(req,res){
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){ 
        return res.status(401).json({msg:"unauthorized"});
     }
     const decoded=jwt.verify(refreshToken,config.JWT_SECRET);
     const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
     const session = await sessionModel.findOneAndDelete({
        refreshToken: refreshTokenHash,
        userId: decoded.id
     });
     if(!session){
        return res.status(404).json({msg:"session not found"});
     }
     res.clearCookie("refreshToken");
     return res.status(200).json({msg:"logout successfully"});

}

async function logoutAll(req,res){
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){
         return res.status(401).json({msg:"unauthorized"});
    }
    const decoded=jwt.verify(refreshToken,config.JWT_SECRET);
    await sessionModel.deleteMany({
        userId: decoded.id
    });
    res.clearCookie("refreshToken");
    return res.status(200).json({msg:"logout from all devices successfully"});

}
export default {register,login,getMe,refreshToken,logout,logoutAll};
