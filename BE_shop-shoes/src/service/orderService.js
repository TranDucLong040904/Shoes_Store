const db = require("../models");
const { sendMailService } = require("./mailService");
const Op = db.Sequelize.Op;
const sizeMapping = {
  36: 1,
  37: 2,
  48: 3,
  39: 4,
  40: 5,
  41: 6,
  42: 7,
};
const sizeMapping2 = {
  1: 36,
  2: 37,
  3: 38,
  4: 39,
  5: 40,
  6: 41,
  7: 42,
};

const addToCartService = async (data) => {
  try {
    if (!data) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }
    if (!data.userId || !data.productId || !data.sizeId || !data.quantity) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }

    const cart = await db.Cart.findOne({
      where: {
        userId: data.userId,
        productId: parseInt(data.productId),
        sizeId:
          data?.sizeId > 10
            ? sizeMapping[parseInt(data.sizeId)]
            : data.sizeId || 0,
      },
    });
    if (!cart) {
      await db.Cart.create({
        userId: data.userId,
        productId: data.productId,
        sizeId: data.sizeId,
        quantity: data.quantity,
      });
    } else {
      await cart.update(
        {
          quantity:
            parseInt(cart.quantity) === 1 && parseInt(data.quantity) === -1
              ? parseInt(cart.quantity)
              : parseInt(cart.quantity) + parseInt(data.quantity),
        },
        {
          where: {
            userId: data.userId,
            productId: data.productId,
            sizeId: sizeMapping[data.sizeId],
          },
        }
      );
    }

    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const getProductInCartServive = async (userId) => {
  if (!userId) {
    return {
      errCode: 1,
      errMessage: "Missing required parameter",
      DT: "",
    };
  }
  const productInCart = await db.Cart.findAll({
    where: { userId: userId },
  });
  console.log(productInCart);
  if (!productInCart) {
    return {
      errCode: 0,
      errMessage: "OK",
      DT: [],
    };
  }
  const listProduct = [];
  for (let i = 0; i < productInCart.length; i++) {
    const product = await db.Product.findOne({
      where: { id: productInCart[i].productId },
    });
    const size = await db.Size.findOne({
      where: { id: productInCart[i].sizeId },
    });
    const newProduct = {
      id: product.id,
      productName: product.productName,
      price: product.price,
      image: product.image,
      quantity: productInCart[i].quantity,
      discount: product.discount,
      size: size.sizeShoes,
    };
    listProduct.push(newProduct);
  }

  return {
    errCode: 0,
    errMessage: "OK",
    DT: listProduct,
  };
};

const createNewOrderService = async (order) => {
  try {
    if (!order) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }
    console.log(order);
    const addOrder = await db.Order.create({
      username: order?.username,
      email: order?.email,
      phone: order?.phone,
      addressDetail: order?.addressDetail,
      note: order?.note || "",
      totalMoney: order?.totalMoney,
      userId: order?.userId || null,
      status: "PENDING",
      province: order?.province,
      district: order?.district,
      ward: order?.ward,
      deliveryType: order?.deliveryType,
      paymentType: order?.paymentType,
    });

    const createOrderDetailsPromises = order?.listProduct?.map((product) =>
      db.OrderDetail.create({
        orderId: addOrder.id,
        productId: product.id,
        price: product.price,
        size: product.size
          ? product.size
          : sizeMapping2[parseInt(product.sizeId)],
        quantity: product.quantity,
        status: "PENDING",
      })
    );

    await Promise.all(createOrderDetailsPromises);

    // Giảm số lượng sản phẩm trong bảng Product
    order?.listProduct?.forEach(async (product) => {
      const productToUpdate = await db.Inventory.findOne({
        where: {
          productId: product.id,
          sizeId: product?.sizeId
            ? product?.sizeId
            : sizeMapping[product?.size] || 0,
        },
      });

      if (productToUpdate) {
        // Giảm số lượng của size cụ thể
        productToUpdate.quantityInStock -= product.quantity;

        // Lưu lại thay đổi vào database
        await productToUpdate.save();
      }
    });

    // delete product in cart after create order
    const productIds = order?.listProduct?.map((product) => product.id);
    const sizeIds = order?.listProduct?.map(
      (product) => sizeMapping[product.size] || 0
    );

    await db.Cart.destroy({
      where: {
        // userId: order.userId,
        [db.Sequelize.Op.and]: [
          {
            productId: {
              [db.Sequelize.Op.in]: productIds,
            },
          },
          {
            sizeId: {
              [db.Sequelize.Op.in]: sizeIds,
            },
          },
        ],
      },
    });
    console.log(order);
    const text = `
    <p>Đơn hàng mới từ ${order?.username}</p>
    <p>Địa chỉ: ${order?.addressDetail}</p>
    <p>Số điện thoại: ${order?.phone}</p>
    <p>Tổng tiền: ${order?.totalMoney}</p>
    <p>Chi tiết đơn hàng:</p>
    <ul>
      ${order?.listProduct
        .map(
          (product) => `
        <li>
          <p>Sản phẩm: ${product.productName}</p>
          <p>Số lượng: ${product.quantity}</p>
          <p>Size: ${product.size}</p>
        </li>
      `
        )
        .join("")}
    </ul>
    <p>Nếu bạn muốn hủy đơn hàng, vui lòng bấm vào đây(Sẽ hủy ngay sau khi bấm, cân nhắc trước khi bấm:)</p>
    <a href="http://localhost:4040/?orderId=${addOrder.id}">Bấm vào đây</a>
`;
    sendMailService(order?.email, "Đơn hàng mới", text);
    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

const getAllOrderService = async (
  page,
  limit,
  sortByName,
  startDate,
  endDate,
  dashboard
) => {
  try {
    let whereCondition = {};
    if (dashboard) {
      whereCondition.status = "SUCCESS";
    }
    if (startDate && endDate) {
      whereCondition.updatedAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
      whereCondition.status = "SUCCESS";
    }
    if (page && limit && sortByName === "true") {
      let offset = (page - 1) * limit;
      const { count, rows } = await db.Order.findAndCountAll({
        offset: offset,
        limit: limit,
        // order: [
        //   ["username", "ASC"], // Sắp xếp theo username tăng dần
        //   // Các điều kiện sắp xếp khác nếu cần
        // ],
        order: [
          // ["username", "ASC"], // Sắp xếp theo username tăng dần
          ["createdAt", "DESC"],
        ],
        include: [
          {
            model: db.OrderDetail,
            as: "orderDetail",
            attributes: ["productId", "price", "size", "quantity", "status"],
            include: [
              {
                model: db.Product, // Thay "Product" bằng tên mô hình sản phẩm của bạn
                as: "product",
                attributes: ["productName"], // Thay "productName", "otherProductAttributes" bằng các thuộc tính sản phẩm bạn muốn lấy
              },
            ],
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
    } else if (page && limit) {
      let offset = (page - 1) * limit;
      const { count, rows } = await db.Order.findAndCountAll({
        offset: offset,
        limit: limit,
        order: [
          // ["username", "ASC"], // Sắp xếp theo username tăng dần
          ["createdAt", "DESC"],
        ],
        where: whereCondition,
        include: [
          {
            model: db.OrderDetail,
            as: "orderDetail",
            attributes: ["productId", "price", "size", "quantity", "status"],
            include: [
              {
                model: db.Product, // Thay "Product" bằng tên mô hình sản phẩm của bạn
                as: "product",
                attributes: ["productName"], // Thay "productName", "otherProductAttributes" bằng các thuộc tính sản phẩm bạn muốn lấy
              },
            ],
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
      const order = await db.Order.findAll({
        include: [
          {
            model: db.OrderDetail,
            as: "orderDetail",
            order: [
              // ["username", "ASC"], // Sắp xếp theo username tăng dần
              ["createdAt", "DESC"],
            ],
            attributes: ["productId", "price", "size", "quantity", "status"],
            include: [
              {
                model: db.Product, // Thay "Product" bằng tên mô hình sản phẩm của bạn
                as: "product",
                attributes: ["productName"], // Thay "productName", "otherProductAttributes" bằng các thuộc tính sản phẩm bạn muốn lấy
              },
            ],
          },
        ],
        // order: [
        //   ["username", "ASC"], // Sắp xếp theo username tăng dần
        //   // Các điều kiện sắp xếp khác nếu cần
        // ],
      });
      return {
        errCode: 0,
        errMessage: "OK",
        DT: order,
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
const getAllOrderByUserIdService = async (userId) => {
  try {
    const order = await db.Order.findAll({
      where: { userId: userId },
      include: [
        {
          model: db.OrderDetail,
          as: "orderDetail",
          attributes: ["productId", "price", "size", "quantity", "status"],
          include: [
            {
              model: db.Product, // Thay "Product" bằng tên mô hình sản phẩm của bạn
              as: "product",
              attributes: ["productName"], // Thay "productName", "otherProductAttributes" bằng các thuộc tính sản phẩm bạn muốn lấy
            },
          ],
        },
      ],
    });
    return {
      errCode: 0,
      errMessage: "OK",
      DT: order,
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

const updateOrder = async (orderId, data) => {
  try {
    if (!orderId || !data) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }

    const order = await db.Order.findOne({
      where: { id: orderId },
    });

    if (!order) {
      return {
        errCode: 1,
        errMessage: "Không tìm thấy đơn hàng",
        DT: "",
      };
    }

    const orderDetails = await db.OrderDetail.findAll({
      where: { orderId: orderId },
    });

    await db.Order.update(
      {
        status: data.status,
      },
      {
        where: { id: orderId },
      }
    );

    if (data.status === "CANCEL") {
      await db.Notification.create({
        name: order.username,
        email: order.email,
        phone: order.phone,
        content: `Đơn hàng ${orderId} đã bị hủy gồm các sản phẩm:\n ${orderDetails
          .map(
            (item) =>
              `ID ${item.productId} - size ${item.size} - ${item.quantity} sản phẩm`
          )
          .join("\n")}`,
        status: 0,
        orderId: orderId,
      });
      for (const orderDetail of orderDetails) {
        const productToUpdate = await db.Inventory.findOne({
          where: {
            productId: orderDetail.productId,
            sizeId: sizeMapping[orderDetail.size],
          },
        });

        if (productToUpdate) {
          // Tăng số lượng sản phẩm trong kho
          productToUpdate.quantityInStock =
            parseInt(productToUpdate.quantityInStock, 10) +
            parseInt(orderDetail.quantity, 10);

          // Lưu lại thay đổi vào database
          await productToUpdate.save();
        }
      }
    }

    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: "",
    };
  }
};

const deleteProductInCartService = async (req) => {
  const userId = parseInt(req.query.userId);
  const productId = parseInt(req.query.productId);
  const sizeId = parseInt(req.query.sizeId);
  try {
    if (!productId || !userId || !sizeId) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }
    const productInCart = await db.Cart.findOne({
      where: {
        userId: userId,
        productId: productId,
        sizeId: sizeMapping[sizeId],
      },
    });

    if (!productInCart) {
      return {
        errCode: 1,
        errMessage: "Không tìm thấy sản phẩm trong giỏ hàng",
        DT: "",
      };
    }

    await db.Cart.destroy({
      where: {
        userId: userId,
        productId: productId,
        sizeId: sizeMapping[sizeId],
      },
    });

    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

const deleteAllProductInCartService = async (req) => {
  const userId = parseInt(req.query.userId);
  try {
    if (!userId) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }
    const productInCart = await db.Cart.findOne({
      where: {
        userId: userId,
      },
    });

    if (!productInCart) {
      return {
        errCode: 1,
        errMessage: "Không tìm thấy sản phẩm trong giỏ hàng",
        DT: "",
      };
    }

    await db.Cart.destroy({
      where: {
        userId: userId,
      },
    });

    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

const deleteOrderService = async (orderId) => {
  try {
    if (!orderId) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter",
        DT: "",
      };
    }
    const order = await db.Order.findOne({
      where: { id: orderId },
    });

    if (!order) {
      return {
        errCode: 1,
        errMessage: "Không tìm thấy đơn hàng",
        DT: "",
      };
    }
    if (order) {
      const orderDetail = await db.OrderDetail.findAll({
        where: { orderId: orderId },
      });
      orderDetail.forEach(async (item) => {
        const product = await db.Inventory.findOne({
          where: {
            productId: item.productId,
            sizeId: item.size,
          },
        });
        if (product) {
          product.quantityInStock += item.quantity;
          await product.save();
        }
      });
      await db.OrderDetail.destroy({
        where: {
          orderId: orderId,
        },
      });
    }

    await db.Order.destroy({
      where: {
        id: orderId,
      },
    });

    return {
      errCode: 0,
      errMessage: "OK",
      DT: "",
    };
  } catch (e) {
    return {
      errCode: -1,
      errMessage: "Lỗi máy chủ",
      DT: e,
    };
  }
};

module.exports = {
  addToCartService,
  getProductInCartServive,
  createNewOrderService,
  getAllOrderService,
  updateOrder,
  deleteProductInCartService,
  deleteAllProductInCartService,
  getAllOrderByUserIdService,
  deleteOrderService,
};
