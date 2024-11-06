import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const getSizeShoes = async (data) => {
  try {
    let data = await db.Size.findAll({ order: [["sizeShoes", "ASC"]] });
    return {
      errCode: 0,
      errMessage: "Lấy size thành công",
      DT: data, //data
    };
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    });
  }
};

module.exports = {
  getSizeShoes: getSizeShoes,
};
