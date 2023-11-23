const userModel = require('../models/User.js');
const { Op } = require('sequelize');

const getUsers = async (req, res, next) => {

    try {

        const data = await userModel.findAll({
            attributes: ['id', 'name',],
            where: {
                id: {
                    [Op.not]: req.user.id
                }
            }
        });
     
        return res.status(200).json({ users: data })
    } catch (err) {
        next(err)
        console.log(err);
    } finally {
        console.timeEnd("authController : signup");
    }
}



module.exports={
    getUsers,

}