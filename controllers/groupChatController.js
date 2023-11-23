const grpChatModel=require('../models/GropChat');
const groupModel = require('../models/Group.js');
const Sequelize = require('sequelize');


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
            limit: 10
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



module.exports={
    getgrpMessages,
    createGrpMessage
}