import "./register.scss"
import {Link, useNavigate} from "react-router-dom"
import { useRef, useState } from "react"
import axios from "axios";
import { baseUrl, makeRequest } from "../../axios";

function Register() {
  const refUsername = useRef();
  const refEmail = useRef();
  const refPassword = useRef()
  const refPasswordAgain=useRef()


  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [password, setPassword]= useState("")
  const [passwordAgain , setPasswordAgain] = useState("")
  const [email, setEmail] = useState("")
  const[errorMsg, setErrMsg]= useState("")
  

  const handleRegister= async (e)=>{
    e.preventDefault()
    try{
      if(!userName){
        setErrMsg("Username is required");
      }else if(!email){
        setErrMsg("Email is required")
      } else if (!email.match(/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)){
        setErrMsg('Enter a valied email')   
      }else if(!password){
        setErrMsg("Password is required")
      }else if(password.length<4){
        setErrMsg("Password must be atleast 4 characters")
      }else if(password.length>20){
        setErrMsg("Password must be less than 20 characters")
      }else if(!refPassword){
        setErrMsg("Re-enter your password")
      }else if(refPasswordAgain.current.value!=refPassword.current.value){
        setErrMsg("your password is not matching")
      }
      else{
        const user = {
          username: refUsername.current.value,
          email: refEmail.current.value,
          password:refPassword.current.value,
        }
         makeRequest.post("/auth/register",user).then((response)=>{
          console.log(response);
          navigate("/login")
        }).catch((err)=>{
          err.response.data.error?setErrMsg(err.response.data.error):setErrMsg(err.response.data.msg)
        })
        
      }
    }catch(err){      
      setErrMsg(err)
    }
  }

  return (
    <div className="register">
        <div className="card">          
            <div className="right">
             <h1 >Register</h1>  
             { errorMsg && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert"> {errorMsg}</div>} 
            <form action="">
                <input ref={refUsername} type="text" placeholder="Username" onChange={(e)=>setUserName(e.target.value)} />
                <input ref={refEmail} type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
                <input ref={refPassword} type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
                <input ref={refPasswordAgain} type="password" placeholder="Re-enter your Password" onChange={(e)=>setPasswordAgain(e.target.value)} />
                <button onClick={(e)=>handleRegister(e)}>Register</button>
            </form>
            <span>Do you have an account?
              <Link to="/login">
              <a  > Login </a>
              </Link>
            </span>  
              

          </div>
          
        </div>
    </div>
  )
}

export default Register