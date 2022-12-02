const io = require("socket.io")(8900,('socket server running...'), {
    cors: {
      origin: ["http://localhost:3000","https://liansocialmedia.ml"]
    },
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    console.log(userId);
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when connect
    console.log("a user connected."); 
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message 
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });

    socket.on("sendNotification",({senderId, reciverId, type})=>{
      console.log(senderId,reciverId);
      const reciver = getUser(reciverId)
      console.log(reciver);
      io.to(reciver?.socketId).emit("getNotification",{
        senderId,
        type, 
      })
    })
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
  