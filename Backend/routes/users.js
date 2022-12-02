const router = require("express").Router()
const User = require("../modules/User")
const NotificationModel = require("../modules/Notification")
//update user 
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id){
        // if(req.body.password){
        //     try{
        //         const salt = await bcrypt.genSalt(10)
        //         req.body.password = await bcrypt.hash(req.body.password,salt)
        //     }catch(err){
        //         return res.status(500).json(err)
        //     }
        // }
        try{
            console.log(req.body);
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body, 
            });
            res.status(200).json("Account has been updated")
        }catch(err){
            return res.status(400).json({msg:"user already exist"})
        }
    }else{
        return res.status(403).json("You can update only your account!");
    }
})
//delete user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted") 
        }catch(err){
            return res.status(500).json(err)
        } 
    }else{
        return res.status(403).json("You can delete only your account!");
    }
})  
//get a user  
router.get("/:userId",async (req,res)=>{
    console.log(req.params.userId,'asfsf');
        User.findById(req.params.userId).then((user)=>{
            console.log(user,'sadfsaf');
            res.status(200).json(user)
        }) .catch((err)=>{
            console.log(err);
        })
    
})  

//get friends
router.get("/friends/:userId", async (req, res) => {
    try { 
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.following.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });
 
//follow a user
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId!== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId); 
            if(!user.followers.includes(req.body.userId)){
             user.updateOne({ $push: { followers:req.body.userId} }).then(()=>{
                 currentUser.updateOne({ $push: {following:req.params.id} }).then(()=>{
                    NotificationModel.create({
                        userId: req.params.id,
                        emiterId:req.body.userId,
                        text:"started following you"
                    }).then(()=>{
                        res.status(200).json("user has been followed");
                    })
                 })
            })
            }else{
              res.status(403).json("you already followed this user")    
            }
 
        }catch(err){  
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("you can't follow yourself")
    }
})
//unfollow


router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId!== req.params.id){
        
        try{
            console.log(req.params.id);
            const user = await User.findById(req.params.id);
            console.log(req.body.userId);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                 user.updateOne({ $pull: { followers:req.body.userId} }).then(()=>{
                     currentUser.updateOne({ $pull: {following:req.params.id} }).then(()=>{
                        NotificationModel.deleteOne({
                            userId: req.params.id,
                            emiterId:req.body.userId,
                            text:"started following you"
                        }).then(()=>{
                            res.status(200).json("user has been unfollowed");
                        })
                    })
                })
            }else{
                res.status(403).json("you dont followed this user")    
            } 



        }catch(err){
            res.status(500).json(err)
        } 
    }else{
        res.status(403).json("you can't unfollow yourself")
    }
})


router.get("/",async(req,res)=>{
    try{
        const users = await User.find();
        console.log(users);
        res.status(200).json(users)
    }catch(err){
        console.log(err);
    }
})


module.exports = router 