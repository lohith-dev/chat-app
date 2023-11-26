const { CronJob } = require('cron');
const {Op} = require('sequelize');
const gropChat = require('../models/GropChat.js');
const normalChat = require('../models/Chat.js');
const ArchivedChat = require('../models/archeived-chat');
const archivedNormalChat =require('../models/archeived-normal-chat.js')
exports.job = new CronJob(
    '0 0 * * *', 
    function () {
        archiveOldRecords();
    },
    null,
    false,
    'Asia/Kolkata'
);

async function archiveOldRecords() {
    try {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      // Find records to archive
      const recordsToArchive = await gropChat.findAll({
        where: {
          date_time: {
            [Op.lt]: tenDaysAgo,
          },
        },
      });
      const normaChatArchived = await normalChat.findAll({
        where: {
          date_time: {
            [Op.lt]: tenDaysAgo,
          },
        },
      });

      // Archive records
      await Promise.all(
        recordsToArchive.map(async (record) => {
          await archivedNormalChat.create({
            id: record.id,
            message: record.message,
            date_time: record.date_time,
            isImage:record.isImage,
            UserId: record.UserId,
          });
          await record.destroy();
        })
      );

      await Promise.all(
        normaChatArchived.map(async (record) => {
          await ArchivedChat.create({
            id: record.id,
            message: record.message,
            date_time: record.date_time,
            isImage:record.isImage,
            UserId: record.UserId,
            GroupId: record.GroupId
          });
          await record.destroy();
        })
      );
      console.log('Old records archived successfully.');
    } catch (error) {
      console.error('Error archiving old records:', error);
    }
  }
