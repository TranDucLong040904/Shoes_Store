import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

// const createNewUser = async (email, password, username) => {
//   let hashPass = hashUserPassword(password);
//   try {
//     await db.User.create({
//       username: username,
//       email: email,
//       password: hashPass,
//     });
//   } catch (error) {
//     console.log(">>> check error:", error);
//   }
// };

// const getUserList = async () => {
//   let users = [];
//   users = await db.User.findAll();

//   return users;
// };

// const deleteUser = async (userId) => {
//   await db.User.destroy({
//     where: { id: userId },
//   });
// };

const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });

  if (user) {
    return true;
  }

  return false;
};

//register
const registerNewUser = async (rawUserData) => {
  // return new Promise(async (resolve, reject) => {
  try {
    //check email are exist
    let isEmailExist = await checkEmailExist(rawUserData.email);
    if (isEmailExist === true) {
      return {
        errCode: 1,
        errMessage: "Email đã thực sự tồn tại",
      };
    }

    //hash user password
    let hashPassword = hashUserPassword(rawUserData.password);

    //create new user
    await db.User.create({
      username: rawUserData.username,
      email: rawUserData.email,
      password: hashPassword,
      phone: rawUserData.phone || "",
      address: rawUserData.address || "",
      roleId: rawUserData.roleId || "USER",
      status: rawUserData.status || "ACTIVE",
    });

    return {
      errCode: 0,
      errMessage: "Tạo người dùng thành công!",
    };
  } catch (e) {
    console.log(e);
    return {
      errCode: -2,
      errMessage: "Lỗi máy chủ",
    };
    // reject(e);
  }
  // });
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword); // true or false
};

const handleUserLogin = async (rawData) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [
          { email: rawData.valueLogin },
          { username: rawData.valueLogin },
        ],
      },
    });

    if (user) {
      console.log(">>> found user with email/username");
      let isCorrectPassword = checkPassword(rawData.password, user.password);
      if (isCorrectPassword === true) {
        console.log("check password");
        const userWithoutPassword = {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          roleId: user.roleId,
          status: user.status,
          addressDetails: user.addressDetails,
          province: user.province,
          district: user.district,
          ward: user.ward,
        };
        return {
          errCode: 0,
          errMessage: "oke!",
          DT: userWithoutPassword, //data
        };
      }
    }

    console.log(
      ">>> Not found user with email/username: ",
      rawData.valueLogin,
      "password:",
      rawData.password
    );
    return {
      errCode: 1,
      errMessage: "Email hoặc mật khẩu không chính xác!",
      DT: "", //data
    };
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    });
  }
};

const getAllStaffService = async (page, limit, sortByName) => {
  try {
    if (sortByName === "true") {
      let offset = (page - 1) * limit;
      let { count, rows } = await db.User.findAndCountAll({
        offset: offset,
        distinct: true,
        limit: limit,
        order: [
          ["username", "ASC"], // Sắp xếp theo username tăng dần
          // Các điều kiện sắp xếp khác nếu cần
        ],
        where: {
          roleId: {
            [db.Sequelize.Op.or]: ["STAFF", "ADMIN"],
          },
        },
        attributes: {
          exclude: ["password"],
        },
      });

      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        suppliers: rows,
      };

      if (data) {
        return {
          errCode: 0,
          errMessage: "oke!",
          DT: data, //data
        };
      }
      return {
        errCode: 1,
        errMessage: "Không tìm thấy nhân viên!",
        DT: "", //data
      };
    } else {
      let offset = (page - 1) * limit;
      let { count, rows } = await db.User.findAndCountAll({
        offset: offset,
        distinct: true,
        limit: limit,
        where: {
          roleId: {
            [db.Sequelize.Op.or]: ["STAFF", "ADMIN"],
          },
        },
        attributes: {
          exclude: ["password"],
        },
      });

      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        suppliers: rows,
      };

      if (data) {
        return {
          errCode: 0,
          errMessage: "oke!",
          DT: data, //data
        };
      }
      return {
        errCode: 1,
        errMessage: "Không tìm thấy nhân viên!",
        DT: "", //data
      };
    }
  } catch (error) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getAllUserService = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    let { count, rows } = await db.User.findAndCountAll({
      offset: offset,
      distinct: true,
      limit: limit,
      where: { roleId: "USER" },
      attributes: {
        exclude: ["password"],
      },
    });

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      suppliers: rows,
    };
    // let users = await db.User.findAll({
    //   where: { roleId: "USER" },
    //   attributes: {
    //     exclude: ["password"],
    //   },
    // });
    if (data) {
      return {
        errCode: 0,
        errMessage: "oke!",
        DT: data, //data
      };
    }
    return {
      errCode: 1,
      errMessage: "Không tìm thấy user!",
      DT: "", //data
    };
  } catch (error) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getOneStaffService = async (userId) => {
  try {
    let user = await db.User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password"],
      },
    });
    if (user) {
      return {
        errCode: 0,
        errMessage: "oke!",
        DT: user, //data
      };
    }
    return {
      errCode: 1,
      errMessage: "Không tìm thấy nhân viên!",
      DT: "", //data
    };
  } catch (error) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const updateUserService = async (data) => {
  try {
    let user = await db.User.findOne({
      where: { id: data.id },
    });
    if (!user) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "User not found",
        DT: "",
      });
    }
    await user.update(data);
    return {
      errCode: 0,
      errMessage: "OK",
      DT: data,
    };
  } catch (error) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const deleteUserService = async (userId) => {
  try {
    let user = await db.User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "User not found",
        DT: "",
      });
    }
    await user.destroy();
    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch (error) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};
module.exports = {
  // createNewUser: createNewUser,
  // getUserList: getUserList,
  // deleteUser: deleteUser,
  registerNewUser: registerNewUser,
  handleUserLogin: handleUserLogin,
  getAllStaffService: getAllStaffService,
  getOneStaffService: getOneStaffService,
  updateUserService: updateUserService,
  deleteUserService: deleteUserService,
  getAllUserService: getAllUserService,
};
