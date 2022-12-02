const router = require("express").Router()
const { response } = require("express");
const verify = require("../middleware/verifeToken");
const NotificationModule = require("../modules/Notification")

router.get('/:id',verify,(req,res)=>{
    try{
        NotificationModule.find({userId:req.params.id})
        .then((response)=>{
            res.status(200).json(response)
        })
    }catch(error){
        res.status(500).json(error)
    }
}),

router.put("/:id",verify,(req,res)=>{
    try{
        NotificationModule.updateMany({userId:req.params.id, isVisited:false},
            {
                $set:{
                    isVisited:true
                }
            })
            .then((response)=>{
                res.status(200).json(response)
            })
    }catch(error){
        res.status(500).json(error)
    }
})




module.exports = router;