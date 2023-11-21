const msgModel=require('../models/Chat.js');



const getMessages = async (req,res,next)=>{
    try {
        const user = req.user;
        const chatHistories = await user.getChatmsgs();
        return res.status(200).json({ chat: chatHistories, message: "User chat History Fetched" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server error!' })
    }
}
const createMessage =async (req, res, next) => {

    try {
        console.log("llllllllllllll");
        const {message}=req.body;
        console.log(req.user.id);
        const data= await msgModel.create({
            message,isImage:false,UserId:req.user.id
        })
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