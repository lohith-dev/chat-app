const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const authenticate = async(request,response,next)=>{
    try {
        const token = request.headers['authorization'];
        const decode = jwt.verify(token,secretKey);
        console.log(decode);
        const user= await User.findByPk(decode.id);
        if(user){
            request.user = user;
            next(); 
        }else{
            response.status(401).send({message:"Unauthorized"});
        }
      
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            response.status(401).json({ message: 'Time out please sign in again' });
        } else {
            response.status(500).json({ message: 'Something went wrong  - please sign again' });
        }
    }
}

module.exports = {
    authenticate
}