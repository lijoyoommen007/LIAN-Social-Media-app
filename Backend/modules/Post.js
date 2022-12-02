const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    desc:{ 
        type:String,
        max:500
    },
    likes:{
        type:Array,
        default:[]
    },
    comments:{
        type:Array,
        default:[]
    },
    img:{
        type:String,
    },
    key:{
        type:String
    }

},
{ timestamps: true}
)

module.exports = mongoose.model("Post", PostSchema)