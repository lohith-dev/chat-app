const express = require('express');
const { createServer } = require("http");
const bodyParser = require('body-parser');
var cors = require('cors')
const fs =require('fs');
const path =require('path');
const { Server } = require("socket.io");
const { instrument } = require('@socket.io/admin-ui');

require('dotenv').config();

const sequelize = require('./util/database');
const app = express();

const websocketService = require('./services/websocket.js');

const userRouter = require('./routes/userRouter.js');
const errorController = require('./controllers/error');
const msgRouter = require('./routes/msgRouter.js');
const grouppRouter = require('./routes/groupRouter.js');
const grpchatRouter = require('./routes/groupChatRouter.js');
const cronService = require('./services/cron.js');
cronService.job.start();


app.use(cors({
    origin: '*',
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());



app.use('/auth', userRouter);
app.use('/msg', msgRouter);
app.use('/group',grouppRouter)
app.use('/grpchat',grpchatRouter)

app.use((req,res)=>{
    console.log("reqqqq");
    res.sendFile(path.join(__dirname,`public${req.url}`))
})


app.use(errorController.get404);

const httpServer = createServer(app);

 const io = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io",],
      credentials: true
    }
  });

io.on('connection',(socket)=>{
    socket.on('new-common-message', ()=> {
            io.emit('common-message',"new common message recieved");
    })
    socket.on('new-group-message', ()=> {
            io.emit('group-message');
    })
})

instrument(io, { auth: false })

// {force:true}
const PORT = process.env.PORT || 3000;
sequelize.sync().then(result=>{
    httpServer.listen(PORT,()=>{
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


