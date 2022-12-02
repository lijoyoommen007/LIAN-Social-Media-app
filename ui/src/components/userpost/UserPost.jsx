import "./userpost.scss";
import { useContext, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {baseUrl, makeRequest} from "../../axios";
import { AuthContext } from "../../context/AuthContext";
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import ImageIcon from '@mui/icons-material/Image';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';

const Share = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [video,setVideo] = useState(null)
  const [desc,setDesc] = useState("")



  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  const handleClick = async (e)=>{
    e.preventDefault()
    const newPost = {
      userId:currentUser._id,
      desc: desc,
    }
    try{
      if(file || video){
      var formData = new FormData();
      video && formData.append("image",video)
      file && formData.append("image", file);
      await makeRequest.post(`uploads/images`,formData ,{
        headers:{'Content-Type': 'multipart/form-data'}
      }).then(async(result)=>{
       console.log(result);
  const location=result.data.location
  const keydata=result.data.key
  const postDetails={
    userId: currentUser._id,
    desc:desc,
    img:location,
    key:keydata
  }
 await makeRequest.post(`/posts`,postDetails)
  console.log('request send');
  queryClient.invalidateQueries(["posts"]);
})
  setFile(null)
  setDesc("")
}else{
  const postDetails={
    userId: currentUser._id,
    desc:desc,
  }
  await makeRequest.post(`posts`,postDetails)
  queryClient.invalidateQueries(["posts"]);

  setDesc("")
}
    }catch(err){

    }

  }

  

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src= {currentUser.profilePicture || altImg} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.username}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file?file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            ):video && <video controls src={URL.createObjectURL(video)}></video> }
          </div>
        </div>
        <hr />
        <div className="bottom ">
          <div className="left ">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/png, image/jpeg"
            />
            <label htmlFor="file">
              <div className="item ">
                {/* <img src={Image} alt="" /> */}
                <span className="font-bold btn "><ImageIcon className="text-red-700"/> Images... </span>
              </div>
            </label>

            <input 
            type="file"
            id="video-file"
            style={{display: "none"}}
            onChange = {(e)=>setVideo(e.target.files[0])}
            accept='video/mp4,video/x-m4v,video/*' 
            />
            <label
            htmlFor="video-file">
              <div className="item">
                <span className="font-bold btn"><VideoLabelIcon className="text-red-700"/> Videos... </span>
              </div>
            </label>
          
            
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;