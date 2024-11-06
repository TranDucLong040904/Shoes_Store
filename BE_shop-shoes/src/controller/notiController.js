import db from "../models/index";

const getAllNoti = async (req, res) => {
  try {
    const noti = await db.Notification.findAll({
      where: {
        status: 0,
      },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(noti);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const deleteNoti = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter",
      });
    }
    const noti = await db.Notification.findOne({
      where: {
        id: id,
      },
    });
    if (!noti) {
      return res.status(200).json({
        errCode: 2,
        errMessage: "Notification not found",
      });
    }
    await db.Notification.update(
      {
        status: 1,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return res.status(200).json({
      errCode: 0,
      errMessage: "Delete notification success",
    });
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

module.exports = {
  getAllNoti: getAllNoti,
};
