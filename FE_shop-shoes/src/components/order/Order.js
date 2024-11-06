import React, { Suspense, useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import "./Order.scss";
import { convertBase64ToImage } from "../../assets/data/image";
import { createOrder, getAllProductInCart } from "../../service/productService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Order = () => {
  const cartProducts = useSelector((state) => state.cart.cartProducts.data);
  const [orderProduct, setOrderProduct] = useState([]);
  const [detailOrder, setDetailOrder] = useState({
    username: "",
    email: "",
    phone: "",
    addressDetail: "",
    note: "",
    totalMoney: "",
    userId: "",
    paymentType: "COD",
    deliveryType: "STANDARD",
    province: "string",
    district: "string",
    ward: "string",
  });
  const [openModalBank, setOpenModalBank] = useState(false);
  useEffect(() => {
    const chooseProduct = localStorage.getItem("chooseProduct");

    if (chooseProduct) {
      setOrderProduct([JSON.parse(chooseProduct)]);
    }
  }, []);
  const [user, setUser] = useState({});
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("chooseProduct");
    };
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!detailOrder.username) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    if (!detailOrder.email) {
      toast.error("Vui lòng nhập email");
      return;
    } else if (!detailOrder.email.includes("@")) {
      toast.error("Email không hợp lệ");
      return;
    }
    if (!detailOrder.phone) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!detailOrder.addressDetail) {
      toast.error("Vui lòng nhập địa chỉ");
      return;
    }
    if (!detailOrder.province) {
      toast.error("Vui lòng chọn tỉnh/thành phố");
      return;
    }
    if (!detailOrder.district) {
      toast.error("Vui lòng chọn quận/huyện");
      return;
    }
    if (!detailOrder.ward) {
      toast.error("Vui lòng chọn xã/phường");
      return;
    }
    if (!detailOrder.deliveryType) {
      toast.error("Vui lòng chọn hình thức giao hàng");
      return;
    }
    if (!detailOrder.paymentType) {
      toast.error("Vui lòng chọn hình thức thanh toán");
      return;
    }
    if (detailOrder?.paymentType === "BANK") {
      setOpenModalBank(true);
    } else {
      await handleSubmit();
    }
  };
  const handleSubmit = async () => {
    try {
      await createOrder({
        ...detailOrder,
        listProduct: orderProduct?.length > 0 ? orderProduct : cartProducts,
      });
      toast.success("Đặt hàng thành công");
      setTimeout(() => {
        localStorage.removeItem("chooseProduct");
        window.location.href = "/";
      }, 2000);
    } catch (e) {
      toast.error("Đặt hàng thất bại");
      console.log(e);
    }
  };

  useEffect(() => {
    const init = detailOrder?.deliveryType === "FAST" ? 65000 : 45000;

    if (orderProduct?.length > 0) {
      setDetailOrder({
        ...detailOrder,
        userId: user?.id,
        username: user?.username,
        email: user?.email,
        phone: user?.phone,
        addressDetail: user?.addressDetails,
        totalMoney:
          parseInt(orderProduct[0]?.price) *
            (orderProduct[0]?.discount
              ? (100 - parseInt(orderProduct[0]?.discount)) / 100
              : 1) *
            parseInt(orderProduct[0]?.quantity) +
          init,
      });
      return;
    } else {
      setDetailOrder({
        ...detailOrder,
        userId: user?.id,
        username: user?.username,
        email: user?.email,
        phone: user?.phone,
        addressDetail: user?.addressDetails,
        totalMoney: cartProducts?.reduce(
          (accumulator, currentValue) =>
            accumulator +
            parseInt(currentValue?.price) *
              ((100 - parseInt(currentValue?.discount || 0)) / 100) *
              currentValue?.quantity,
          init
        ),
      });
    }
  }, [detailOrder.deliveryType, orderProduct, cartProducts, user]);

  return (
    <Suspense>
      <Navbar />
      <Modal
        show={openModalBank}
        onHide={() => {
          setOpenModalBank(false);
        }}
        // className="modal-order"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Thông tin thanh toán
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex items-center justify-center w-full flex-col">
            <img src="/qrcode.png" alt="" className="w-52 h-52" />
            <div className="flex flex-col gap-2 items-start">
              <span>Ngân hàng: Vietcombank</span>
              <span>Số tài khoản: 0123455678</span>
              <span>Tên chủ tài khoản: NGUYEN VAN A</span>
              <span>
                Số tiền:{" "}
                {detailOrder?.totalMoney.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={props.onHide}>Lưu</Button> */}
          <Button
            onClick={() => {
              setOpenModalBank(false);
            }}
          >
            Hủy
          </Button>
          <Button variant="secondary" onClick={handleSubmit}>
            Xác nhận đã thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="order">
        <h2 className="title">Đăt hàng</h2>
        <div className="content-order">
          <div className="content-left">
            <form className="row g-3 needs-validation">
              <div className="col-md-12">
                <label className="form-label">
                  Người nhận <span>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={detailOrder?.username}
                  onChange={(e) => {
                    setDetailOrder({
                      ...detailOrder,
                      username: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">
                  Email <span>*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={detailOrder?.email}
                  onChange={(e) => {
                    setDetailOrder({ ...detailOrder, email: e.target.value });
                  }}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">
                  Điện thoại <span>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={detailOrder?.phone}
                  onChange={(e) => {
                    setDetailOrder({ ...detailOrder, phone: e.target.value });
                  }}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">
                  Địa chỉ <span>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={detailOrder?.addressDetail}
                  onChange={(e) => {
                    setDetailOrder({
                      ...detailOrder,
                      addressDetail: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Ghi chú</label>
                <textarea
                  name="description"
                  id="description"
                  rows="6"
                  className="p-2 border w-100"
                  onChange={(e) =>
                    setDetailOrder({ ...detailOrder, note: e.target.value })
                  }
                ></textarea>
              </div>
            </form>
          </div>
          <div className="middle-content">
            <label className="form-label">Giao hàng</label>
            <div className="delivery">
              <ul>
                <li>
                  <input
                    type="radio"
                    name="selected"
                    value="65000"
                    onChange={(e) =>
                      setDetailOrder({
                        ...detailOrder,
                        deliveryType: "FAST",
                      })
                    }
                  />
                  <label>
                    Giao hàng nhanh trong ngày:
                    <span>65.000₫</span>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    name="selected"
                    value="45000"
                    defaultChecked
                    onChange={(e) =>
                      setDetailOrder({
                        ...detailOrder,
                        deliveryType: "STANDARD",
                      })
                    }
                  />
                  <label>
                    Giao hàng tiêu chuẩn(3-5 ngày toàn quốc):
                    <span>45.000₫</span>
                  </label>
                </li>
              </ul>
            </div>

            <label className="form-label">Thanh toán</label>
            <div className="delivery">
              <ul>
                <li>
                  <input
                    type="radio"
                    name="paied"
                    defaultChecked
                    onChange={() =>
                      setDetailOrder({
                        ...detailOrder,
                        paymentType: "COD",
                      })
                    }
                  />
                  <label>Thanh toán khi nhận hàng (COD)</label>
                </li>
                <li>
                  <input
                    type="radio"
                    name="paied"
                    onChange={() =>
                      setDetailOrder({
                        ...detailOrder,
                        paymentType: "BANK",
                      })
                    }
                  />
                  <label>Chuyển khoản ngân hàng</label>
                </li>

                <li>
                  <p>
                    <strong>Chú ý:</strong>Sau khi đặt hàng thành công vào email
                    kiểm tra lại đơn hàng của bạn. Cảm ơn bạn đã đặt hàng tại
                    Shoes
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="content-right">
            <label className="form-label">Đơn hàng của bạn</label>
            <tbody className="order-review">
              {orderProduct?.length > 0 ? (
                <tr className="cart-item">
                  <td className="product-name">
                    <div className="p-1 product-thumbnail">
                      <img
                        src={convertBase64ToImage(orderProduct[0]?.image)}
                        alt=""
                        className="w-[100%] h-[100%] object-cover"
                      />
                    </div>
                    <div className="product-desc">
                      <span>{orderProduct[0]?.productName}&nbsp;</span>
                      <strong className="product-quantity">
                        &nbsp;× {orderProduct[0]?.quantity}
                      </strong>
                      <dl className="variation-price">
                        <dt className="variation">
                          Size:{" "}
                          {orderProduct[0]?.sizeId === 1
                            ? "36"
                            : orderProduct[0]?.sizeId === 2
                            ? "37"
                            : orderProduct[0]?.sizeId === 3
                            ? "38"
                            : orderProduct[0]?.sizeId === 4
                            ? "39"
                            : orderProduct[0]?.sizeId === 5
                            ? "40"
                            : orderProduct[0]?.sizeId === 6
                            ? "41"
                            : "42"}
                        </dt>
                        <dd className="price" style={{ float: "right" }}>
                          <bdi>
                            {Math.round(
                              parseInt(orderProduct[0]?.price) *
                                parseInt(orderProduct[0]?.quantity) *
                                (orderProduct[0]?.discount
                                  ? (100 -
                                      parseInt(orderProduct[0]?.discount)) /
                                    100
                                  : 1)
                            ).toLocaleString("vi-VN")}
                            ₫
                          </bdi>
                        </dd>
                      </dl>
                    </div>
                  </td>
                </tr>
              ) : (
                cartProducts.map((item, key) => (
                  <tr className="cart-item" key={key}>
                    <td className="product-name">
                      <div className="p-1 product-thumbnail">
                        <img
                          src={convertBase64ToImage(item?.image)}
                          alt=""
                          className="w-[100%] h-[100%] object-cover"
                        />
                      </div>
                      <div className="product-desc">
                        <span>{item?.productName}&nbsp;</span>
                        <strong className="product-quantity">
                          &nbsp;× {item?.quantity}
                        </strong>
                        <dl className="variation-price">
                          <dt className="variation">Size: {item?.size}</dt>
                          <dd className="price" style={{ float: "right" }}>
                            <bdi>
                              {Math.round(
                                parseInt(item?.price) *
                                  parseInt(item?.quantity) *
                                  (item?.discount
                                    ? (100 - parseInt(item?.discount)) / 100
                                    : 1)
                              ).toLocaleString("vi-VN")}
                              ₫
                            </bdi>
                          </dd>
                        </dl>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <div className="order-total">
              Phí ship:{" "}
              {detailOrder?.deliveryType === "FAST" ? (
                <span>65.000₫</span>
              ) : (
                <span>45.000₫</span>
              )}
            </div>
            <div className="text-lg font-semibold order-total">
              Tổng:{" "}
              {Math.round(detailOrder?.totalMoney)?.toLocaleString("vi-VN")}₫
            </div>
            <div className="payment">
              <button
                onClick={(e) => {
                  handleCreateOrder(e);
                }}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Order;
