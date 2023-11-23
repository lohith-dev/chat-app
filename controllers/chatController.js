const msgModel=require('../models/Chat.js');
const Sequelize = require('sequelize');


const getMessages = async (req,res,next)=>{
    try {
        const lastTimestamp = req.query.timestamp || 0;
        console.log(lastTimestamp);
        const user = req.user;
        const chatHistories = await user.getChatmsgs({
            where: {
                date_time: {
                  [Sequelize.Op.gt]: new Date(lastTimestamp) // Retrieve messages created after the provided timestamp
                },
                
              },
              order: [['date_time', 'DESC']], 
            limit: 10
        });
        const reversedResult=chatHistories.reverse();
        return res.status(200).json({ chat: reversedResult, message: "User chat History Fetched" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server error!' })
    }
}


const createMessage =async (req, res, next) => {
   
    try {
      
        const {message}=req.body;
        console.log(req.user.id);
        const data= await msgModel.create({
            message,isImage:false,UserId:req.user.id
        })
        return res.status(200).json({ message: "Successful" })
    } catch (err) {
        next(err)
        console.log(err);
    } finally {
        
    }
}



module.exports={
    createMessage,
    getMessages
}