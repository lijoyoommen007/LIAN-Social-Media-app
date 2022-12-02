const router = require("express").Router()
const User = require('../modules/User')
const bcrypt = require("bcrypt");
const createUserMiddleware = require("../middleware/validateuser");
const Schemas = require("../validations/authValidator");
const  jwt =require("jsonwebtoken")
require("dotenv").config()

//......REGISTER
router.post("/register",createUserMiddleware(Schemas.createUserSchema),async (req,res)=>{
   
   try {
    //generate new password
    if (req.body.username && req.body.email && req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //save user and respond
      await newUser.save().then((user)=>{
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
      }).catch((err)=>{res.status(400).json({msg:"user already exist",err})});
      
    } else {
      res.status(400).json("fill all credentials")
    }
  } catch (err) {
    res.status(500).json(err)
  }

});


//.......LOGIN

router.post("/login",async(req,res)=>{
  console.log("reached here");
    try{
      console.log(req.body);
    User.findOne({username:req.body.username}).then((user)=>{
    !user && res.status(404).json("user not found");

    if(user){ 

   bcrypt.compare(req.body.password, user.password).then((valiedPassword )=>{
    
   
    !valiedPassword && res.status(404).json("wrong username or password")
      if(valiedPassword){
    const accessToken = jwt.sign(
      {id:user._id, 
      user:user.username},
      process.env.JWT,
      {expiresIn:"7d"});
    res.cookie("accessToken", accessToken,
    {httpOnly:true}).status(200).json({user,accessToken})
    }
  })
  }
  })
    }catch(err){ 
        res.status(500).json(err)
    } 
    
})

module.exports = router