const groupModel = require('../models/Group.js');
const userModel =require('../models/User.js')

const getGroups = async (req, res, next) => {
  
    try {
        const user=req.user;
        console.log(user);
        const data = await userModel.findAll({
            where: { id: user.id },
            attributes:['id', 'name'],
             include:[
                {
                    model: groupModel,
                    attributes: ['id', 'name','numberOfMembers'],
                    through: { attributes: [] },
                }
             ]   
        })
        return res.status(200).json({ groups: data })
    } catch (err) {
        next(err)
        console.log(err);
    } finally {
        console.timeEnd("authController : signup");
    }
}

const getEditGroup = async (req, res, next) => {
  
    try {
        const grpId=req.params.id;
        console.log(grpId);
        // console.log(user);
        const data = await groupModel.findAll({
            where: { id: grpId},
            attributes:['id', 'name'],
             include:[
                {
                    model: userModel,
                    as:'Users',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                }
             ]   
        })
        console.log(data);
        return res.status(200).json({ group: data })
    } catch (err) {
        next(err)
        console.log(err);
    } finally {
        console.timeEnd("authController : signup");
    }
}


const creatGroups = async (req, res, next) => {

    try {
        const {name,numberOfMembers,membersIds}=req.body;
        console.log(req.body);
        const group = await groupModel.create({
            name,numberOfMembers,AdminId:req.user.id
        });
        membersIds.push(req.user.id);
        await group.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        return res.status(200).json({ group, message: "Group is succesfylly created" })
    } catch (err) {
        next(err)
        console.log(err);
    } 
}


const UpdateGroup = async (req, res, next) => {

    try {
        const {name,numberOfMembers,membersIds}=req.body;
        console.log(req.body);
        const group = await groupModel.create({
            name,numberOfMembers,AdminId:req.user.id
        });
        membersIds.push(req.user.id);
        await group.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        return res.status(200).json({ group, message: "Group is succesfylly created" })
    } catch (err) {
        next(err)
        console.log(err);
    } 
}

module.exports={
    getGroups,
    getEditGroup,
    creatGroups,
    UpdateGroup
}