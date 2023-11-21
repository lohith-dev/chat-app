const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const fs =require('fs');
const path =require('path');

require('dotenv').config();

const sequelize = require('./util/database');
const app = express();

const userRouter = require('./routes/userRouter.js');
const errorController = require('./controllers/error');
const msgRouter = require('./routes/msgRouter.js')

app.use(cors({
    origin:'null'
}));
app.use(bodyParser.urlencoded({ extended: true }));





app.use(express.json());



app.use('/auth', userRouter);
app.use('/msg', msgRouter);


app.use(errorController.get404);
// {force:true}
const PORT = process.env.PORT || 3000;
sequelize.sync().then(result=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT} `);
    });
})
.catch(err=>{
    console.log(err);
})

// app.listen(8000,()=>{
//     console.log("Server listening at port 8000");
// });
module.exports=app;


