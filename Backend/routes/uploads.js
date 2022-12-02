const express = require("express");
// import multerS3  from 'multer-s3'
const AWS = require('aws-sdk')
const multer = require('multer')
const fs = require('fs')
require("dotenv").config()
const { deleteImageStack, uploadFile } = require("../s3");
const path = require('path')
const { generateKey } = require("crypto");
const router=express.Router()

const AWS_ACESS= process.env.AWS_ACESS
const AWS_SECRET=process.env.AWS_SECRET
const AWS_BUCKET_NAME=process.env.AWS_BUCKET_NAME
const AWS_BUCKET_REGION=process.env.AWS_BUCKET_REGION


const s3=new AWS.S3({
    accessKeyId: AWS_ACESS,
    secretAccessKey:AWS_SECRET,
})




const imageStorage = multer.diskStorage({
    // Destination to store image     
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});
const imageUpload = multer({
    storage: imageStorage,
}) 

router.post('/images',imageUpload.single('image'),async(req,res)=>{
    try{
 const file=req.file
 
 console.log(req.file,'fsdsfdd');
 
   
  
//  const result= await uploadFile(file)
//  console.log(result,'result here');
//     res.json(result)
 function uploadFile (file)  {
        // Read content from the file
        const fileContent = fs.readFileSync(file.path);
    
        // Setting up S3 upload parameters
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: file.filename, // File name you want to save as in S3
            Body: fileContent
        };
    
        s3.putObject(params).promise()
        // Uploading files to the bucket
      s3.upload(params,    function (err, data) {
          if (err) {
            console.log(err);
              res.status(500).json(err)
          } if (data) {
            
              console.log(data);
              res.json({location:data.Location,key:data.key})
          } else {
             
              res.status(404).json({ message: "response not found from s3" }) 
          }
    
      })
    };
  uploadFile(file)
    }catch(err){
      console.log(err,"yyhhghgjghjghjhjhgjhg");
      
        res.status(500).json(err)
    } 
})



router.post('/delete-images', async (req, res) => {
    try {
      const { imageRefs } = req.body;
      // Calling our helper function
    let result=  await deleteImageStack(imageRefs);
   
      res.status(201).json('image deleted');
    } catch(e) {
     
      res.status(500).json('error happened cannot delete');
    }
  });


module.exports= router

