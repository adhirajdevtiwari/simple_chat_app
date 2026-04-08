import userModel from "../models/user.model.js";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import sessionModel from "../models/session.model.js";



async function registerUser(req,res){
    const {username,email,password}=req.body;
    const isAlreadyRegistered=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isAlreadyRegistered){
        return res.status(400).json({
            success:false,
            message:'Username or Email already already registered'
        })

    }
    const hashedPassword=crypto.createHash('sha256').update(password).digest('hex');
    const user=await userModel.create({
        username,
        email,
        password:hashedPassword
    })
    
    
    const refreshToken=jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:'1d'})
    const refreshTokenHash=crypto.createHash('sha256').update(refreshToken).digest('hex');
    const session=await sessionModel.create({
        user:user._id,
        refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers['user-agent'],
        revoked:false
    })

    const accesstoken=jwt.sign({id:user._id,sessionId:session._id},config.JWT_SECRET,{expiresIn:'15m'})
    res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:true,expires:new Date(Date.now()+1000*60*60*24*7)})

    res.status(201).json({
        success:true,
        message:'User registered successfully',
        person:{
            username,
            email,
                accesstoken,
            expiresIn:'1d'
        },
        accesstoken
    })

   
}


async function getMe(req,res){ 
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({
            success:false,
            message:'Please register first'
        })
    }
    const decoded=jwt.verify(token,config.JWT_SECRET);
    console.log(decoded);
    const user=await userModel.findOne({_id:decoded.id});
    
    res.status(200).json({
        success:true,
        message:'User details',
        person:{
            username:user.username,
            email:user.email,
            token,
            expiresIn:'1d'
        }
    })

}   
async function refreshToken(req,res){
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:'Please register first'
        })
    }
    try{
        const decoded=jwt.verify(refreshToken,config.JWT_SECRET);
        const accessToken=jwt.sign({id:decoded.id},config.JWT_SECRET,{expiresIn:'15m'})
        const newRefreshToken=jwt.sign({id:decoded.id},config.JWT_SECRET,{expiresIn:'1d'})
        res.cookie("refreshToken",newRefreshToken,{httpOnly:true,secure:true,expires:new Date(Date.now()+1000*60*60*24*7)})
        res.status(200).json({
            success:true,
            message:'Access token refreshed successfully',
            accessToken
        })
    }catch(err){
        return res.status(401).json({
            success:false,
            message:'Refresh token is invalid'
        })
    }

}
export { registerUser, getMe,refreshToken};
