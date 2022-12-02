import "./Login.scss"
import {BrowserRouter, Link, useNavigate} from 'react-router-dom'
import { useContext, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useState } from "react"

function Login() {

  const {login} = useContext(AuthContext)
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [password, setPassword]= useState("")
  const[errorMsg, setErrMsg]= useState("")
  const refEmail = useRef()
  const refPassword = useRef()

  
  

  const handleLogin= async (e)=>{
    const details = {
      username : refEmail.current.value,
      password : refPassword.current.value
    }
    e.preventDefault()
    try{
      if(!userName){
        setErrMsg("Username is required");
      }else if(!password){
        setErrMsg("Password is required")
      }else if(password.length<4){
        setErrMsg("Password must be atleast 4 characters")
      }else if(password.length>20){
        setErrMsg("Password must be less than 20 characters")
      }else{
        login(details).then(()=>{
          navigate("/")
        }).catch((error)=>{
          setErrMsg(error.response.data)
        })
      }
    }catch(error){
      
    }
  }

  return (
    <div className="login animate-slideright">
        <div className="card">          
            <div className="right">
             <h1 >Login</h1>   
             { errorMsg && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert"> {errorMsg}</div>}
            <form action="">
                <input type="text" className="outline-none"
                name="username"
                ref={refEmail}
                 placeholder="Username" 
                 required
                 onChange={(e)=>{setUserName(e.target.value)}}  />
                <input type="password"
                className="outline-none"
                ref={refPassword}
                 name="password"
                 placeholder="Password"
                 required
                 onChange={(e)=>{setPassword(e.target.value)}}   
                />
                <button className="outline-none" onClick={(e)=>handleLogin(e)}>Login</button>              
            </form>
            
            <span>Don't have an account? 
              <Link to='/register'>
                <a > Register </a>
              </Link> 
            </span>
            <div className="or">
                <span>Or login with</span>
            </div>
            <div className="button" >
            <button class="loginBtn loginBtn--facebook">
                    Facebook
                </button>
                
                <button class="loginBtn loginBtn--google">
                   Google
                </button>
            </div>

          </div>
          
        </div>
    </div>
  )
}

export default Login