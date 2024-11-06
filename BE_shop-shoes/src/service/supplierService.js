import db from "../models/index";

const createNewSuppiler = async (data) => {
  try {
    await db.Supplier.create(data);
    return {
      errCode: 0,
      errMessage: "Thêm nhà cung cấp thành công",
      DT: [], //data
    };
  } catch {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    });
  }
};

const getSupplierPagination = async (page, limit, sortByName) => {
  try {
    if (sortByName === "true") {
      let offset = (page - 1) * limit;
      let { count, rows } = await db.Supplier.findAndCountAll({
        offset: offset,
        limit: limit,
        order: [
          ["name", "ASC"], // Sắp xếp theo username tăng dần
          // Các điều kiện sắp xếp khác nếu cần
        ],
      });

      let totalPages = Math.ceil(count / limit);
      let data = { totalRows: count, totalPages: totalPages, suppliers: rows };

      return {
        errCode: 0,
        errMessage: "Lấy data thành công",
        DT: data,
      };
    } else {
      let offset = (page - 1) * limit;
      let { count, rows } = await db.Supplier.findAndCountAll({
        offset: offset,
        limit: limit,
      });

      let totalPages = Math.ceil(count / limit);
      let data = { totalRows: count, totalPages: totalPages, suppliers: rows };

      return {
        errCode: 0,
        errMessage: "Lấy data thành công",
        DT: data,
      };
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: [],
    });
  }
};

const getAllSuppliers = async () => {
  try {
    let supp = await db.Supplier.findAll();
    if (supp) {
      return {
        errCode: 0,
        errMessage: "Lấy data nhà cung cấp thành công",
        DT: supp, //data
      };
    } else {
      return {
        errCode: 0,
        errMessage: "Lấy data nhà cung cấp thành công",
        DT: [], //data
      };
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: [],
    });
  }
};

const deleteSupplier = async (id) => {
  try {
    let supp = await db.Supplier.findOne({
      where: { id: id },
    });
    if (supp) {
      await supp.destroy();
      return {
        errCode: 0,
        errMessage: "Xóa nhà cung cấp thành công",
        DT: [], //data
      };
    } else {
      return {
        errCode: 2,
        errMessage: "Nhà cung cấp này không tồn tại",
        DT: [], //data
      };
    }
  } catch (error) {
    console.log(error);
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: [],
    };
  }
};

const updateSupplier = async (data) => {
  try {
    let supp = await db.Supplier.findOne({
      where: { id: data.id },
    });

    if (supp) {
      await supp.update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });

      return {
        errCode: 0,
        errMessage: "Cập nhật nhà cung cấp thành công",
        DT: "", //data
      };
    } else {
      return {
        errCode: 2,
        errMessage: "Ko tìm nhà cung cấp",
        DT: "", //data
      };
    }
  } catch (error) {
    console.log(error);
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: [],
    };
  }
};

module.exports = {
  createNewSuppiler: createNewSuppiler,
  getSupplierPagination: getSupplierPagination,
  getAllSuppliers: getAllSuppliers,
  deleteSupplier: deleteSupplier,
  updateSupplier: updateSupplier,
};
