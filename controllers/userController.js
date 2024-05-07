const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const secret = process.env.JWT_SECRET;
const emailjs = require('@emailjs/nodejs')
const passport = require('../utils/passport')
const jwt = require("jsonwebtoken");
const createUser = asynchandler(async (req, res) => {
  const { email, username, password,name } = req.body;
  if (!email || !username || !password  || !name) {
    return res.status(401).json({
      message: "missing-data",
    });
  }
  const existingUser = await User.findOne({
    email: email,
  });
  
  if (existingUser) {
    if(!existingUser.emailVerified){
      console.log(existingUser)
      return res.status(200).json({
        email:existingUser.email,
        
      })
    }
    else{
    return res.status(401).json({
      message: "email-exist",
      
    });
  }
  }
  const exisitingUsername = await User.findOne({
    username: username,
  });
  if (exisitingUsername) {
    return res.status(401).json({
      message: "username-taken",
    });
  }
  const code = Math.floor(1000 + Math.random() * 9000);
  const createUser = new User({
    name,
    email,
    username,
    password,
    
    emailVerificationCode:code,
    emailCodeExpiry: Date.now() + 10 * 60 * 1000,
  });
  await createUser.save()
  const serviceID = process.env.EMAILJS_SERVICEID
  const templateID = process.env.EMAILJS_TEMPLATEID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const  privateKey = process.env.EMAILJS_PRIVATE_KEY
  await sendEmailVerificationCode(serviceID,templateID,publicKey,privateKey,code,name,email)

  return res.status(200).json({
    message: "code-Sent",
    email:createUser.email
  });
});

const loginUser =asynchandler( async (req, res, next) => {
  passport.authenticate("user", async function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }


    const payload = { id: user.id };
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 3600000,
    });

    return res.json({
      message: "auth-success",
      token: token,
      user,
    })
  })(req, res, next);
})

const verifyCode = asynchandler(async(req,res)=>{
  const {email,code} =req.body
  const user = await User.findOne({email:email})
  console.log(user)
  if(user.emailVerified){
    return res.status(200).json({message:"email-verified"})
  }
  if(code === user.emailVerificationCode){
    // if (Date.now() > user.emailCodeExpiry){
    //   return res.status(400).json({message:"code-expired"})
    // }
    user.emailCodeExpiry=null
    user.emailVerified=true
    user.emailVerificationCode=null
    await user.save()
    return res.status(200).json({message:"email-verified"})
  }
  return res.status(200)
})

const getUser = asynchandler(async(req,res)=>{
  return res.status(200).json({
    message:"auth-success",
    user:req.user
  })

})
const editProfile = asynchandler(async(req,res)=>{
  const {name,bio,username} = req.body

  
  try{
    if(req.user.username !==username){
  const isUserNameAvailable = await User.findOne({username:username})
  if(isUserNameAvailable){
  return  res.status(400).json({
      message:'username-taken'
    })
  }
}

  
   
    const updatedUser = await User.findByIdAndUpdate(req.user.id,{
      name: name ? name : req.user.name,
      bio : bio ? bio : req.user.bio,
      username : username ? username : req.user.username
    },{new:true})
    await updatedUser.save()
    if(!updatedUser){
     return res.status(400).json({
        message:"user-not-found",
        
      })
    }
    updatedUser.emailVerified = undefined;
    updatedUser.password = undefined;
    updatedUser.emailVerificationCode = undefined;
    updatedUser.emailCodeExpiry= undefined
   return res.status(200).json({
      message:"user-updated",
      user:updatedUser
    })
  }catch(e){
   return res.status(500).json({
      message:"server-error"
    })
  }
})
async function sendEmailVerificationCode(
  serviceID,
  templateID,
  publicKey,
  accessToken,
  code,
  name,
  email
) {

  const templateParams = {
    code: code,
    to_name: name,
    email: email,
  };
  await emailjs
  .send(serviceID, templateID, templateParams, {
    publicKey: publicKey,
    privateKey: accessToken, // optional, highly recommended for security reasons
  })
  .then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (err) => {
      console.log('FAILED...', err);
    },
  );
}
module.exports = { createUser,loginUser,verifyCode,getUser,editProfile };
