const grpChatModel=require('../models/GropChat');
const groupModel = require('../models/Group.js');
const userModel = require('../models/User.js');
const Sequelize = require('sequelize');
const AWS = require('aws-sdk');

const getgrpMessages = async (req,res,next)=>{

    try {
        const lastTimestamp = req.query.timestamp || 0;
        console.log(lastTimestamp);
        const {id}=req.params;
        console.log(id);
        console.log(lastTimestamp);
        const group = await groupModel.findOne({where:{id:id}});

        console.log(group);
        
        const chatHistories = await group.getGropChats({
            where: {
                date_time: {
                  [Sequelize.Op.gt]: new Date(lastTimestamp) // Retrieve messages created after the provided timestamp
                },
              },
            order: [['date_time', 'DESC']], 
            limit: 10,
            include:[{
                model: userModel,
                attributes: ['id', 'name'],
            }]
        });
        const reversedResult=chatHistories.reverse();
        return res.status(200).json({ chat: reversedResult, message: "User chat History Fetched" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server error!' })
    }
}


const createGrpMessage =async (req, res, next) => {

    console.log(req.body);
        try {
            const user = req.user;
            const { message, groupId } = req.body;
                const gid=parseInt(groupId);
                await user.createGropChat({
                    message,isImage:false,GroupId:gid,
                })
        
            return res.status(200).json({ message: "Message saved to database succesfully" })
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server error!' })
        }
    
}


const uploadToS3 =(data,filename)=>{
   
    const BUCKET_NAME ='e-track123';
    // const userKey =process.env.IAM_USER_KEY;
    // const userSecret=process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId:process.env.IAM_USER_KEY,
        secretAccessKey:process.env.IAM_USER_SECRET,
        Bucket : BUCKET_NAME
    })
    var params ={
        Bucket : BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
    }
    return new Promise ((resolve,reject)=>{
        s3bucket.upload(params,(err,data)=>{
            if(err){
                reject(err)
            }else{
                resolve(data.Location)
              
            }
        })
    })
}

const fileUpload =async (req, res, next) => {
  try{
    const user = req.user;
    const image = req.file;
    const { GroupId } = req.body;
    const filename = `chat-images/group${GroupId}/user${req.user.id}/${Date.now()}_${image.originalname}`;
    const imageUrl = await uploadToS3(image.buffer, filename)
    // console.log(recFile);
    // console.log(GroupId);
    await user.createGropChat({
        message:imageUrl,isImage:true,GroupId,
    })
    return res.status(200).json({ message: "image saved to database succesfully" })
  }catch(err){
    console.log(err);
  }
}

module.exports={
    getgrpMessages,
    createGrpMessage,
    fileUpload
}