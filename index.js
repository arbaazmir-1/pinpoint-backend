require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const cors = require('cors')
const passport = require('./utils/passport')
const sectionRouter = require('./routes/sectionRoutes')
const linkRouter = require('./routes/linkRoutes');
const asynchandler = require("express-async-handler");
const User = require('./models/userModel')
const Link = require('./models/linksModel')
var corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))
app.use(express.json());
const url = process.env.MONGODB_URL
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log("Error connecting to the database", err);
    });
}
app.use("/api/auth", userRouter);
app.use('/api/links',passport.authenticate("jwt-verify",{session:false}),sectionRouter)
app.use('/api/links',passport.authenticate("jwt-verify",{session:false}),linkRouter)
app.get('/:username', asynchandler(async(req,res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "no-user" });
  }
  
  if (!user.links) {
    return res.status(400).json({ message: "no-links" });
  }

  try {
    const links = await Link.findById(user.links);
    if (!links) {
      return res.status(400).json({ message: "no-links" });
    }
    
    const publishedSections = links.sections.filter(section => section.published);
    user.password = undefined;
        user.emailVerificationCode = undefined;
        user.emailCodeExpiry= undefined
    return res.status(200).json({ links: publishedSections,message:'success', user});
  } catch (error) {
    console.error("Error finding links:", error);
    return res.status(500).json({ message: "server-error" });
  }
}));


app.listen(3000, () => {
  console.log("listening bro");
});
