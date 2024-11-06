import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op, literal } from "sequelize";

const createNewProduct = async (data) => {
  try {
    const {
      userId,
      productName,
      image,
      description,
      price,
      discount,
      supplier,
      images,
      inventory,
    } = data;

    if (!productName || !price || !inventory) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      });
    }
    const product = await db.Product.create({
      productName: productName,
      image: image,
      description: description,
      price: price,
      discount: discount,
      supplier: supplier,
      userId: userId,
    });

    // let images = [];
    // to see if files field exist

    if (images?.length > 0 && product?.id) {
      // logic to save url in db
      const createImagePromises = images?.map((image) =>
        db.Image.create({
          image: image || "",
          productId: product?.id,
        })
      );
      await Promise.all(createImagePromises);
    }

    if (inventory?.length > 0 && product?.id) {
      const createInventoryPromises = inventory?.map((inventory) =>
        db.Inventory.create({
          productId: product?.id,
          sizeId: inventory?.sizeId,
          quantityInStock: inventory?.quantityInStock,
        })
      );
      await Promise.all(createInventoryPromises);
    }
    // will assume req.body has required fields
    // here use association mixins
    // await product.addImages(images);
    // //tao san pham

    return {
      errCode: 0,
      errMessage: "OK",
      DT: data,
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: e.message,
      DT: "",
    };
  }
};

const updateProductService = async (data) => {
  try {
    const { productId, images, inventory, ...productData } = data;
    console.log(productId);
    if (!productId) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      });
    }
    const product = await db.Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Product not found",
        DT: "",
      });
    }
    // update product
    await product.update(productData);

    if (images?.length > 0 && product) {
      // delete old images
      await db.Image.destroy({
        where: {
          productId: product.id,
        },
      });

      // logic to save url in db
      const createImagePromises = images?.map((image) =>
        db.Image.create({
          image: image || "",
          productId: product?.id,
        })
      );
      await Promise.all(createImagePromises);
    }

    if (inventory?.length > 0 && product?.id) {
      // delete old inventory
      await db.Inventory.destroy({
        where: {
          productId: product.id,
        },
      });

      const createInventoryPromises = inventory?.map((inventory) =>
        db.Inventory.create({
          productId: product?.id,
          sizeId: inventory?.sizeId,
          quantityInStock: inventory?.quantityInStock,
        })
      );
      await Promise.all(createInventoryPromises);
    }
    // will assume req.body has required fields
    // here use association mixins
    // await product.addImages(images);
    // //tao san pham

    return {
      errCode: 0,
      errMessage: "OK",
      DT: product,
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

const getOneProductService = async (productId) => {
  try {
    const product = await db.Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Product not found",
        DT: "",
      });
    }

    let images = await db.Image.findAll({
      where: { productId: product.id },
    });

    const inventory = await db.Inventory.findAll({
      where: { productId: product.id },
    });

    return {
      errCode: 0,
      errMessage: "OK",
      DT: {
        ...product.dataValues,
        images: images.map((img) => img.image),
        inventory: inventory.map((inv) => ({
          sizeId: inv.sizeId,
          quantityInStock: inv.quantityInStock,
        })),
      },
    };
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getAllProductService = async (page, limit, searchParams) => {
  try {
    if (page && limit) {
      let offset = (page - 1) * limit;
      const whereClause = {};
      if (searchParams?.supplier) {
        whereClause.supplier = searchParams?.supplier;
      }

      if (searchParams?.minPrice) {
        whereClause.price = {
          [Op.gte]: searchParams?.minPrice,
        };
      }

      if (searchParams?.maxPrice) {
        whereClause.price = {
          ...whereClause.price,
          [Op.lte]: searchParams?.maxPrice,
        };
      }
      if (searchParams?.search) {
        whereClause.productName = {
          [Op.like]: `%${searchParams.search}%`, // Sử dụng Op.like để tìm kiếm không phân biệt chữ hoa chữ thường
        };
      }
      const sizesArray = searchParams?.sizes
        ? searchParams.sizes.split(",").map((size) => parseInt(size, 10))
        : [1, 2, 3, 4, 5, 6, 7];

      console.log("====================================");
      console.log(whereClause);
      console.log("====================================");
      let { count, rows } = await db.Product.findAndCountAll({
        offset: offset,
        distinct: true,
        limit: limit,
        where: whereClause,
        include: [
          {
            model: db.Inventory,
            as: "inventories",
            where: {
              sizeId: { [Op.in]: sizesArray },
            },
          },
        ],
      });

      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        suppliers: rows,
      };
      return {
        errCode: 0,
        errMessage: "OK",
        DT: data,
      };
    } else {
      const products = await db.Product.findAll({
        include: [
          {
            model: db.Image,
            as: "images",
            attributes: ["image"],
          },
          {
            model: db.Inventory,
            as: "inventories",
            attributes: ["sizeId", "quantityInStock"],
          },
        ],
      });

      return {
        errCode: 0,
        errMessage: "OK",
        DT: products,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};
const deleteProductService = async (productId) => {
  try {
    const product = await db.Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      return res.status(500).json({
        errCode: 1,
        errMessage: "Product not found",
        DT: "",
      });
    }

    await db.Image.destroy({
      where: {
        productId: product.id,
      },
    });

    await db.Inventory.destroy({
      where: {
        productId: product.id,
      },
    });

    await product.destroy();

    return {
      errCode: 0,
      errMessage: "OK",
      DT: product,
    };
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getProductSaleService = async (page, limit) => {
  try {
    if (page && limit) {
      let offset = (page - 1) * limit;
      const { count, rows } = await db.Product.findAndCountAll({
        offset: offset,
        limit: limit,
        where: {
          discount: {
            [Op.gt]: 0,
          },
        },

        order: [["discount", "DESC"]],
      });
      let totalPages = Math.ceil(count / limit);
      console.log(rows);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        suppliers: rows,
      };
      return {
        errCode: 0,
        errMessage: "OK",
        DT: data,
      };
    } else {
      const products = await db.Product.findAll({
        where: {
          discount: {
            [Op.gt]: 0,
          },
        },
        include: [
          {
            model: db.Image,
            as: "images",
            attributes: ["image"],
          },

          {
            model: db.Inventory,
            as: "inventories",
            attributes: ["sizeId", "quantityInStock"],
          },
        ],
        order: [["discount", "DESC"]],
      });
      return {
        errCode: 0,
        errMessage: "OK",
        DT: products,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

const getProductBestSellerService = async () => {
  try {
    const products = await db.OrderDetail.findAll({
      attributes: [
        "productId",
        "orderId",
        [db.sequelize.fn("SUM", db.sequelize.col("quantity")), "totalQuantity"],
      ],
      include: [
        {
          model: db.Order,
          as: "order",
          attributes: [],
          where: {
            status: "SUCCESS", // Chỉ lấy các đơn hàng có status là "SUCCESS"
          },
        },
      ],
      include: [
        {
          model: db.Product,
          as: "product",
          // attributes: ["productName", "image", "price", "discount"],
        },
      ],
      group: ["productId", "orderId"],
      order: [[db.sequelize.literal("totalQuantity"), "DESC"]],
    });

    return {
      errCode: 0,
      errMessage: "OK",
      DT: products,
    };
  } catch (e) {
    console.log(e);
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

const getDataManageAdminService = async () => {
  try {
    const totalRevenue = await db.Order.sum("totalMoney", {
      where: {
        status: "SUCCESS",
      },
    });
    const totalRevenueYear = await db.Order.sum("totalMoney", {
      where: {
        status: "SUCCESS",
        createdAt: {
          [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 1 YEAR)"),
        },
      },
    });
    const totalRevenueWeek = await db.Order.sum("totalMoney", {
      where: {
        status: "SUCCESS",
        createdAt: {
          [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 1 WEEK)"),
        },
      },
    });
    console.log(totalRevenue);
    const monthlyRevenue = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn("DATE", db.sequelize.col("createdAt")), "day"],
        [db.sequelize.fn("SUM", db.sequelize.col("totalMoney")), "totalMoney"],
      ],
      where: {
        status: "SUCCESS",
        createdAt: {
          [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 1 YEAR)"),
        },
      },
      group: [db.sequelize.fn("DATE", db.sequelize.col("createdAt"))],
      raw: true,
    });
    const totalCustomers = await db.User.count({
      where: {
        roleId: "USER",
      },
    });
    const totalProducts = await db.Product.count();
    const totalOrdersPending = await db.Order.count({
      where: {
        status: "PENDING",
      },
    });
    const totalOrders = await db.Order.count();

    const data = {
      totalRevenue: totalRevenue,
      totalRevenueYear: totalRevenueYear,
      totalRevenueWeek: totalRevenueWeek,
      totalCustomers: totalCustomers,
      totalProducts: totalProducts,
      totalOrdersPending: totalOrdersPending,
      monthlyRevenue: monthlyRevenue,
      totalOrders: totalOrders,
    };
    return {
      errCode: 0,
      errMessage: "OK",
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};
module.exports = {
  createNewProduct: createNewProduct,
  updateProductService: updateProductService,
  getOneProductService: getOneProductService,
  getAllProductService: getAllProductService,
  deleteProductService: deleteProductService,
  getProductSaleService: getProductSaleService,
  getProductBestSellerService: getProductBestSellerService,
  getDataManageAdminService: getDataManageAdminService,
};
