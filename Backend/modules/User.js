const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const profilePicture = "./360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju"

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3, 
        max:20,
        unique:true
    },
    email:{
        type:String,
        require:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:6
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        max:50
    },
    city:{
        type:String,
        max:50
    },
    from:{
        type:String,
        max:50
    },
    relationship:{
        type:Number,
        num:[1, 2, 3],
    }

},
{timestamps:true}
)

UserSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWTPRIVATEKEY,{expiresIn:"7d"}) 
    return token
}

module.exports = mongoose.model("User", UserSchema)