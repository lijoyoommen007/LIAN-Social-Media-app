import { useContext, useState } from "react";
import { baseUrl, makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from 'axios'
import {useNavigate,Link} from 'react-router-dom'
import Swal from 'sweetalert2'
import { AuthContext } from "../../context/AuthContext";
const Update = ({ setOpenUpdate, user }) => {
  const {setCurrentUser,currentUser} = useContext(AuthContext)
  const navigate = useNavigate()
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [email,setEmail] = useState('')
  const [error, setError] = useState('');
  const [username,setUsername]=useState('');
  const [city,setCity]=useState("");
  const [desc,setDesc] = useState("")
  const [picToCloud,setpicToCloud] = useState("")
  const [coverToCloud,setCoverToCloud] = useState("")
  const [texts, setTexts] = useState({
    email: user.email,
    name: user.username,
    city: user.city,
    desc:user.desc
  });
  



  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        var profilePic = new FormData();
        profilePic.append("image", profile);
        await makeRequest.post(`uploads/images`,profilePic ,{
        headers:{'Content-Type': 'multipart/form-data'}
        }).then(async(picToCloud)=>{
            var coverPic = new FormData();
            coverPic.append("image",cover);
            await makeRequest.post(`uploads/images`,coverPic,{
            headers:{'Content-Type': 'multipart/form-data'}
        }).then(async(coverToCloud)=>{
            setCoverToCloud(coverToCloud)
            const details ={
                userId:user._id,
                email : email?email: user.email ,
                username: username?username:user.username ,
                city : city?city:user.city,
                desc : desc?desc:user.desc,
                profilePicture: picToCloud.data.location  ,
                coverPicture : coverToCloud.data.location  ,    
              } 
                await makeRequest.put(`users/${user._id}`,details).then(async(response) => {
                    console.log('update success',response);
                    queryClient.invalidateQueries(["user"]);
                    setCurrentUser({
                      ...currentUser,
                      email : email?email: user.email ,
                username: username?username:user.username ,
                city : city?city:user.city,
                desc : desc?desc:user.desc,
                profilePicture: picToCloud.data.location  ,
                coverPicture : coverToCloud.data.location  ,
                })  
                    setOpenUpdate(false)
                    let updatedUser = await makeRequest.get(`users/${user._id}`)
                    console.log(updatedUser);                    
                }).catch((err)=>{
                 err.response.data.error?setError(err.response.data.error):setError(err.response.data.msg)
                  
              })
    
          
        })
        })
        
        
    } catch (error) {
      setError(true)
      console.log(error);
    }
   console.log(error);
   if(error)
   {
    Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error',
        confirmButtonText: 'ok'
      })
   }

  };

  
  



  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();


  return (
    <div className="update">
    <div className="wrapper">
      <h1>Update Your Profile</h1>
      { error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert"> {error}</div>}
      <form>
        <div className="files">
          <label htmlFor="cover">
            <span>Cover Picture</span>
            <div className="imgContainer">
              <img
                src={
                  cover
                    ? URL.createObjectURL(cover)
                    : "/upload/" + user.coverPic
                }
                alt=""
              />
              <CloudUploadIcon className="icon" />
            </div>
          </label>
          <input
            type="file"
            id="cover"
            required
            style={{ display: "none" }}
            onChange={(e) => setCover(e.target.files[0])}
          />
          <label htmlFor="profile">
            <span>Profile Picture</span>
            <div className="imgContainer">
              <img
                src={
                  profile
                    ? URL.createObjectURL(profile)
                    : "/upload/" + user.profilePic
                }
                alt=""
              />
              <CloudUploadIcon className="icon" />
            </div>
          </label>
          <input
            type="file"
            required
            id="profile"
            style={{ display: "none" }}
            onChange={(e) => setProfile(e.target.files[0])}
          />
        </div>
        <label>Email</label>
        <input
          type="text"
          name="email"
          placeholder={texts.email}
          required
          onChange={(e)=>{setEmail(e.target.value)}}
        />
        <label>Name</label>
        <input
          type="text"
          required
          name="name"
          onChange={(e)=>{setUsername(e.target.value)}}
        />
        <label>Country / City</label>
        <input
          type="text"
          name="city"
          placeholder={texts.city}
          onChange={(e)=>{setCity(e.target.value)}}
        />
        <label>Description</label>
        <input
          type="text"
          name="desc"
          placeholder={texts.desc}
          required
          onChange={(e)=>{setDesc(e.target.value)}}
        />
        <button onClick={handleSubmit}>Update</button>
      </form>
      <button className="close" onClick={() => setOpenUpdate(false)}>
        close
      </button>
    </div>
  </div>
  );
}
export default Update
