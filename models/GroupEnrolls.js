const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const GroupEnrollments = sequelize.define('GroupEnrollments',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    }},
    {
        timestamps: false
    });

module.exports=GroupEnrollments;