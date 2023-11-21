const Sequelize = require('sequelize');
const sequelize  = require('../util/database');
const Chatmsg = require('../models/Chat.js')


const User = sequelize.define('User',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement :true,
    allowNull:false,
    primaryKey:true
  }, 
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique:true,
    allowNull: false,
  },
  phone:{
    type: Sequelize.STRING,
    unique:true,
    allowNull: false,
  },
  password :{  
    type: Sequelize.STRING,
    allowNull: false,
  }
},
{
    timestamps: true,
    underscored: true
})

User.hasMany(Chatmsg);  
Chatmsg.belongsTo(User);

module.exports = User;
