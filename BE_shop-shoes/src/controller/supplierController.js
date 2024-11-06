import supplierService from "../service/supplierService";

const createSupplier = async (req, res) => {
  try {
    const data = await supplierService.createNewSuppiler(req.body);
    return res.status(200).json({
      errCode: data.errCode,
      errMessage: data.errMessage,
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const getSuppliers = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let sortByName = req.query.sortByName;
      const data = await supplierService.getSupplierPagination(
        +page,
        +limit,
        sortByName
      );
      return res.status(200).json({
        errCode: data.errCode,
        errMessage: data.errMessage,
        DT: data.DT, //data
      });
    } else {
      const data = await supplierService.getAllSuppliers();
      return res.status(200).json({
        errCode: data.errCode,
        errMessage: data.errMessage,
        DT: data.DT, //data
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const deleteSupp = async (req, res) => {
  try {
    let data = await supplierService.deleteSupplier(req.body.id);
    return res.status(200).json({
      errCode: data.errCode,
      errMessage: data.errMessage,
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const updateSupp = async (req, res) => {
  try {
    let data = await supplierService.updateSupplier(req.body);
    return res.status(200).json({
      errCode: data.errCode,
      errMessage: data.errMessage,
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

module.exports = {
  createSupplier: createSupplier,
  getSuppliers: getSuppliers,
  deleteSupp: deleteSupp,
  updateSupp: updateSupp,
};
