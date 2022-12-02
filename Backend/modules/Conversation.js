const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const ConversationSchema = new mongoose.Schema(
{ 
    members:{
        type:Array,

    },
},
{ timestamps: true}
)

module.exports = mongoose.model("Conversation", ConversationSchema)