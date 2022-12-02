const AWS = require('aws-sdk')
const fs = require('fs')
require("dotenv").config()



  
const AWS_ACESS= process.env.AWS_ACESS 
const AWS_SECRET=process.env.AWS_SECRET
const AWS_BUCKET_NAME=process.env.AWS_BUCKET_NAME
const AWS_BUCKET_REGION=process.env.AWS_BUCKET_REGION

 



 




const s3=new AWS.S3({
    accessKeyId: AWS_ACESS,
    secretAccessKey:AWS_SECRET,
})



 const uploadFile = async(file) => {
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
 await s3.upload(params, async function (err, data) {
      if (err) {
          return { message: "error happened here" };
      } if (data) {
      
          return data.Location
      } else {
        
          return { message: "response not found from s3" };
      }

  })
};

exports.uploadFile = uploadFile

//image_1667624032345.jpg



  // Helper function to delete (N) images
const deleteImageStack = async (imageRefs)=> {
try{
  // Deleting the image
  await s3.deleteObject({
    Bucket:AWS_BUCKET_NAME,
    Key:imageRefs
  }).promise().then(()=>{
    return  {message:"image deleted successfully",error:false};
  }).catch((err)=>{return {message:"error happened",error:err}});
  
  // Recursively doing so
  
}catch(err){
    return {message:"error happened",error:err}
}
}
exports.deleteImageStack = deleteImageStack






// //upload a file to s3
// export function uploadFile(file:any){
//     console.log('file here coe');
    
//     const fileStream=fs.createReadStream(file.path) 
//     const uploadParams={
//         Bucket:AWS_BUCKET_NAME,
//         Body:fileStream,
//         key:file.filename
//     }
//     return s3.upload(uploadParams).promise()
// }





//download a file from s3


