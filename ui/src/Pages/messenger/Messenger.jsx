import "./messenger.css"
import "../../style.scss"
import NavBar from "../../components/navBar/NavBar"
import { DarkModeContext } from "../../context/darkModeContext"
import { useContext } from "react"
import Conversation from "../../components/messenger/Conversation"
import Message from "../../components/messenger/Message"
import ChatOnline from "../../components/messenger/ChatOnline"
import { AuthContext } from "../../context/AuthContext"
import { useState } from "react"
import { useEffect } from "react"
import { makeRequest } from "../../axios"
import { useRef } from "react"
import {io} from "socket.io-client"
import { Link } from "react-router-dom"


export default function Messenger() {
    const {darkMode} = useContext(DarkModeContext)

    const [conversation,setConversation] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [select, setSelect]=useState(false)
    const [onlinUsers,setOnlineUsers] = useState([])
    const [userDetails,setUserDetails] = useState(null)
    const {currentUser} = useContext(AuthContext)
    const scrollRef= useRef()
    const socket = useRef()
    
    useEffect(()=>{
        socket.current = io('https://socket.liansocialmedia.ml');
            socket.current.on("getMessage",(data)=>{
                setArrivalMessage({
                    sender:data.senderId,
                    text:data.text,
                    createdAt:Date.now(),
                });
            });
    },[]);

    useEffect(()=>{
        arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) && 
        setMessages((prev)=> [...prev,arrivalMessage])
    },[arrivalMessage, currentChat])

    useEffect(()=>{
        socket.current.emit("addUser",currentUser._id);
        socket.current.on("getUsers", (users)=>{
            console.log(users);
            setOnlineUsers(
                currentUser.following.filter((f) => users.some((u) => u.userId === f))
              );
        })
    },[currentUser])


    useEffect(()=>{
        const getConversations = async ()=>{
            try{
                const res = await makeRequest.get("/conversations/"+currentUser._id)
                setConversation(res.data)
            }catch(err){
                console.log(err);
            }

        }
        getConversations()
    },[currentUser._id])

    useEffect(()=>{
        const getMessages = async ()=>{
            try{
                const res = await makeRequest.get("/messages/"+currentChat?._id)
                setMessages(res.data)
            }catch(err) {
                console.log(err);
            }
        };
        getMessages();
    },[currentChat]);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const message = {
            sender: currentUser._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find((member)=>member!==currentUser._id)

        socket.current.emit("sendMessage",{
            senderId: currentUser._id,
            receiverId,
            text:newMessage
        })

        try{
            const res = await makeRequest.post("/messages",message)
            setMessages([...messages, res.data])
            setNewMessage('')
        }catch(err){
            console.log(err);
        }
    };

    

    useEffect(()=>{
        scrollRef?.current?.scrollIntoView({behavior:"smooth"});
    },[messages]);


    useEffect(()=>{
        const friendId = currentChat?.members.find((m)=> m !== currentUser._id);
        console.log(friendId);

        if(friendId){
        const getUser = async () =>{
          try{
            const res = await makeRequest.get("/users/"+friendId)
            console.log(res.data);
            setUserDetails(res.data)
          }catch(err){
            console.log(err);
          }
        }
        getUser()
        };
       
      },[currentUser, currentChat]);

    
  return (
    <>
    <div className={`theme-${darkMode? "dark":"light"} animate-slideleft`}>
      <div className="themesbg">
    <NavBar/>
    <div className="messenger" >
        <div className="chatMenu">
            <div className="chatMenuWrapper">
                <input placeholder="Search for friends" className="chatMenuInput"/>
                {conversation.map((c)=>{
                    if(select === c._id){
                    return <div onClick={()=>{setCurrentChat(c); setSelect(c._id)} }>
                        {<Conversation bg={true} conversation={c} currentUser={currentUser}/>}
                    </div>
                    }else{
                    return <div onClick={()=>{setCurrentChat(c); setSelect(c._id)} }>
                        {<Conversation bg={false} conversation={c} currentUser={currentUser}/>}
                    </div>
                    }

  })}
                
            </div>
        </div>
        
        <div className="chatBox">
            <div className="chatBoxWrapper">
            
                {

                    currentChat ?

                <>
                <Link to={`/profile/${userDetails?._id}`}>
                <div className=" h-20 bg-gray-300  w-full flex items-center rounded-3xl">
                    <img className="w-16 h-16 rounded-full object-cover ml-3" src={userDetails?.profilePicture} alt="" />
                    <span className="ml-5 font-bold text-xl ">{userDetails?.username}</span>
                </div>
                </Link>
                <div className="chatBoxTop ">
                    {messages.map((m)=>(
                        <div ref={scrollRef}>
                            <Message messages={m} own = {m.sender === currentUser._id} /> 
                        </div>
                    ))}

                        
                </div>   
                <div className="chatBoxBottom">
                    <textarea placeholder="write something..." className="chatMessageInput rounded-3xl" onChange={(e)=>setNewMessage(e.target.value)} value={newMessage} ></textarea>
                    <button className="chatSubmitButton w-28 text-xl h-14 rounded-3xl hover:bg-green-700" onClick={handleSubmit}>Send</button>
                </div> 
                </>: <div className="chatHeader">
                    <span className="noConversationText">Open a conversation to start a chat.</span>
                    </div>
                }
            </div>
               
            
        </div>   
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
                <ChatOnline 
                onlinUsers={onlinUsers} 
                currentId={currentUser._id} 
                setCurrentChat={setCurrentChat}/>
            </div>
        </div>

    </div>
    </div>
    </div>
    </>
  )
}
