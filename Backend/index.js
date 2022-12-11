const express = require('express')
const cors = require("cors")
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const uploadRoute = require("./routes/uploads") 
const messagesRoute = require("./routes/messages")
const conversationRoute = require("./routes/conversation")
const notificationRoute = require("./routes/notification")

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,()=>{
    console.log("Connected to MongoDB"); 
});    


   
//middleware 
app.use((req, res, next) => {  
  res.header("Access-Control-Allow-Credentials", true); 
  next();
});
app.use(express.json()); 
app.use(
  cors({
    origin: ["http://localhost:3000","https://liansocialmedia.ml"],
  })
); 
app.use(cookieParser());
app.use(express.json());
app.use(helmet()); 
app.use(morgan("common")); 

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)   
app.use("/api/posts",postRoute)
app.use("/api/uploads",uploadRoute) 
app.use("/api/conversations",conversationRoute)
app.use("/api/messages",messagesRoute)
app.use("/api/notifications",notificationRoute)



app.listen(8000,()=>{  
    console.log("backend is running!.....")
}) 