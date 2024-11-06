import productService from "../service/productService";

const createProduct = async (req, res) => {
  try {
    const product = await productService.createNewProduct(req.body);

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProductService(req.body);

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: e, //data
    });
  }
};

const getOneProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.getOneProductService(productId);

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.deleteProductService(productId);

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;

    const searchParams = {
      supplier: req.query.supplierName || "", // Đặt giá trị mặc định là rỗng nếu không được cung cấp
      minPrice: +req.query.minPrice || "",
      maxPrice: +req.query.maxPrice || "",
      sizes: req.query.sizes || "",
      search: req.query.search || "",
    };

    const product = await productService.getAllProductService(
      +page,
      +limit,
      searchParams
    );

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: e, //data
    });
  }
};

const getProductSale = async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;
  console.log(page, limit);
  try {
    const product = await productService.getProductSaleService(+page, +limit);

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: e, //data
    });
  }
};

const getProductBestSeller = async (req, res) => {
  try {
    const product = await productService.getProductBestSellerService();

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: e, //data
    });
  }
};

const getDataManageAdmin = async (req, res) => {
  try {
    const product = await productService.getDataManageAdminService();

    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: e, //data
    });
  }
};
module.exports = {
  createProduct: createProduct,
  updateProduct: updateProduct,
  getOneProduct: getOneProduct,
  deleteProduct: deleteProduct,
  getAllProduct: getAllProduct,
  getProductSale: getProductSale,
  getProductBestSeller: getProductBestSeller,
  getDataManageAdmin: getDataManageAdmin,
};
