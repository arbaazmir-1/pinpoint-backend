const express = require("express");
const { createUser,loginUser, verifyCode, getUser, editProfile} = require("../controllers/userController");
const router = express.Router();
const passport = require('../utils/passport')
router.post("/register", createUser);

router.post("/login",loginUser);
router.post('/verify',verifyCode)
router.get('/getUser',passport.authenticate("jwt-verify",{session:false}),getUser)
router.put('/updateUser',passport.authenticate("jwt-verify",{session:false}),editProfile)
module.exports = router;
