const msgModel=require('../models/Chat.js');

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

}