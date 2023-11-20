const userModel = require('../models/User.js');
let bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {

    console.time("authController : signup");
    let { name, email,phone,password } = req.body;

    email = email.toLowerCase();
    console.log("authController : signup :: email is ", email);
    try {
        const isUserExists = await userModel.findOne({ where: { email: email } });
        // console.log("authController : signup :: isUserExists : ", isUserExists);
        // when the user already register.
        if (isUserExists) {
            res.status(409).json({
                error: true,
                message: "User already exists..",
                data: null
            });
        } else {
            let saltRound = 10;
            let salt = await bcrypt.genSalt(saltRound);
            let hashedPassword = await bcrypt.hash(password, salt)

            let userResponse = await userModel.create({
                    name,email,phone,password:hashedPassword,
                })

            if(userResponse){
                res.status(200).json({
                    error: false,
                    message: 'Register Successfully',
                    data: [userResponse]
                })
            }
        
        }
    } catch (err) {
        next(err)
        console.log(err);
    } finally {
        console.timeEnd("authController : signup");
    }
}


let signin = async (req, res, next)=>{
    console.time("authController : signup");
    let {email,password } = req.body;
    email = email.toLowerCase();
    console.log(req.body);
    console.log("authController : signup :: email is ", email);
    try {
        const UserData = await userModel.findOne({ where: { email: email } });
        // when the user already register.
        
        if (UserData) {
            let {id,name,email}=UserData;
            // console.log("ddddddddddffffffff",UserData);
            let isPasswordValid = await bcrypt.compare(password,UserData.password);
            const payload = {id,name,email};
            const token = jwt.sign(payload, "thisissecreateKey", { expiresIn: "24hr" });
                
            if(isPasswordValid){
                res.status(200).json({
                    error: false,
                    message: "Login Succesfull",
                    token: token
                });    
            }else{
                res.status(401).json({
                    error: true,
                    message: "Invalid Password",
                    data: null
                });  
            }
            
        } else {

            // let userResponse = await userModel.create({
            //         name,email, password,
            //     })

            // if(userResponse){
            //     res.status(200).json({
            //         error: false,
            //         message: 'Register Successfully',
            //         data: [userResponse]
            //     })
            // }
            res.status(404).json({
                error: true,
                message: "User not found",
                data: null
            });
        
        }
    } catch (err) {
        next(err)
    } finally {
        console.timeEnd("authController : signup");
    }
}

module.exports={
    signup,
    signin
}