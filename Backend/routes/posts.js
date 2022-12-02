const router = require("express").Router();
const Post = require("../modules/Post");
const User = require("../modules/User");
const verify = require("../middleware/verifeToken");
const NotificationModel = require("../modules/Notification");


//create a post 

router.post("/", async (req,res,next)=>{
    console.log(req.body);
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)   
    }
})


//update a post 

router.put("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("The post has been updated")
        }else{
            res.status(403).json("you can update only your post")
        }
    }catch(err){
        res.status(500).json(err)
    }
   
})

//delete a post 

router.delete("/:id",verify,async(req,res)=>{
    console.log("reacher here");
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.user.id){
            await post.deleteOne()
            res.status(200).json("The post has been deleted")
        }else{
            res.status(403).json("you can delete only your post")
        }
    }catch(err){
        res.status(500).json(err)
    }
   
})

//like a post & dislike a post 

router.put("/:id/like",verify, async(req,res)=>{
    try {
        console.log(req.params.id,req.user.id);
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.user.id)){
            await post.updateOne({$push:{likes:req.user.id} });
            if (post.userId != req.params.id) {
                NotificationModel.create({
                  userId: post.userId,
                  emiterId: req.user.id,
                  text: 'liked your post.',
                  postId: req.body.postId
                })
                  .then((response) => res.status(200).json("post liked"))
                  .catch((error) => res.status(500).json(error))
              } else res.status(200).json("post liked")
           
        }else{
            await post.updateOne({$pull:{likes:req.user.id}})
            if (post.userId != req.params.id) {
                NotificationModel.deleteOne({
                  userId: post.userId,
                  emiterId: req.user.id,
                  text: 'liked your post.',
                  postId: req.body.postId
                })
                  .then((response) => res.status(200).json("post disliked"))
                  .catch((error) => res.status(500).json(error))
              } else res.status(200).json("post liked")            
        }
    } catch (err) {
        res.status(500).json(err)    
    }
})

//get a post 

router.get("/:id", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
        
    }
}),

//get timeline post 

router.get("/timeline/:userId", async (req,res)=>{
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPost = await Post.find({userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId)=>{
               return Post.find({userId: friendId}); 
            })
        );
        res.status(200).json(userPost.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err)
    }
})

// comment a post

router.post('/comment/:id',async (req,res)=>{
    try{
        const userComments={ 
            userId:req.body.userId,
            comment:req.body.comments,
            createdAt:new Date
        }
        
        const post = await Post.findById(req.params.id)
        await post.updateOne({$push:{comments:userComments}});
        res.status(200).json("commented successfully")
    }catch(err){
        res.status(500).json(err)
    }
     
}) 

// get user's all posts

router.get("/profile/:id", async (req,res)=>{
    //console.log(req.params.id)
        const user = await User.findOne({_id:req.params.id})
        const posts = await Post.find({userId:user._id})
       // console.log(user+'sdfgsdfg',posts);
        res.status(200).json(posts)
    
})

 


module.exports=router