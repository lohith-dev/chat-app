const Sequelize = require('sequelize');
const sequelize  = require('../util/database');


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



module.exports = User;
