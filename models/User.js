const Sequelize = require('sequelize');
const sequelize  = require('../util/database');
const Chatmsg = require('../models/Chat.js')
const GroupsModel = require('../models/Group.js');
const GroupEnrollModel = require('../models/GroupEnrolls.js');
const GropChat = require('../models/GropChat.js');


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


GroupsModel.belongsTo(User,{foreignKey: 'AdminId',constraints:true,onDelete:'CASCADE'});

User.belongsToMany(GroupsModel, { through: GroupEnrollModel });
GroupsModel.belongsToMany(User, { through: GroupEnrollModel });

console.log(GroupsModel.associations);
User.hasMany(GropChat)
GropChat.belongsTo(User);

GropChat.belongsTo(User, { constraints: true });

GroupsModel.hasMany(GropChat);
GropChat.belongsTo(GroupsModel);

// GroupsModel.hasOne(GropChat);
// GropChat.belongsTo(GroupsModel);
console.log(GroupsModel.associations)
module.exports = User;
