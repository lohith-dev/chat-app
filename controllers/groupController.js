const groupModel = require('../models/Group.js');
const userModel =require('../models/User.js');
const { Op } = require('sequelize');

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
        console.log(req.query.admin);
        let data;
       
        if(req.query.admin){
            data =await groupModel.findOne({where:{id:grpId}})
        }else{
            data = await groupModel.findAll({
                where: { id: grpId},
                attributes:['id', 'name'],
                 include:[
                    {
                        model: userModel,
                        as:'Users',
                        attributes: ['id', 'name'],
                        through: { attributes: [] },
                        where: {
                           id: {
                                [Op.not]: req.user.id
                            }
                        },
                        plain : true
                    },
                    
                 ]  ,
              raw:true    
            },
            )
            let UserData = await userModel.findAll({
                attributes:['id', 'name'],
                where: {
                    id: {
                        [Op.not]: req.user.id
                    }
                },
                raw:true,
            });

            const notMembers= UserData.filter(userdata=>{
    
                return !data.some(gData=>gData['Users.id']===userdata.id)
            })

            const mergedArray = UserData.reduce((acc, id) => {
                let obj={};
                obj.id=id.id;
                obj.name=id.name;
                obj.member=data.some(gData=>gData['Users.id']===id.id) ;
                acc.push(obj);
                return acc;
              }, []);
        
            //   console.log(data[0].name);
            return res.status(200).json({group:mergedArray,gropName:data[0].name})
        }
        
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
        const user = req.user;
        const { groupId } = req.params;
        const group = await groupModel.findOne({ where: { id: Number(groupId) } });
        const { name, membersNo, membersIds } = req.body;
        const updatedGroup = await group.update({
            name,
            membersNo,
        })
        membersIds.push(user.id);
        await updatedGroup.setUsers(null);
        await updatedGroup.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        return res.status(200).json({ updatedGroup, message: "Group is succesfylly updated" });

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