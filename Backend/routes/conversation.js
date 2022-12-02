const router = require("express").Router()
const Conversation = require('../modules/Conversation')

//new Conversation

router.post("/",async(req,res)=>{
    console.log(req.body);
    const newConversation = new Conversation({
        members:[req.body.senderId, req.body.reciverId],
    });
    try{
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation)
    }catch(err){
        res.status(500).json(err)
    }
});

//get conversation of a user

router.get("/:userId",async(req,res)=>{
    console.log(req.params.userId);
    try{
        const conversation = await Conversation.find({
            members:{$in: [req.params.userId]},
        });
        res.status(200).json(conversation)
    }catch(err){
        res.status(500).json(err)
    }
})

//get conv includes two userId


router.get("/find/:firstUserId/:secondUserId",async(req,res)=>{ 
    try{

        const conversation = await Conversation.findOne({
            members: { $all : [req.params.firstUserId, req.params.secondUserId]}
        });
        if(conversation){
            res.status(200).json(conversation)
        }else{
            const newConversation = new Conversation({
                members:[req.params.firstUserId, req.params.secondUserId],
            });
            try{
                const savedConversation = await newConversation.save();
                res.status(200).json(savedConversation)
            }catch(err){
                res.status(500).json(err)
            }
        }

    }catch(err){
        res.status(500).json(err)
    }
})



module.exports = router;