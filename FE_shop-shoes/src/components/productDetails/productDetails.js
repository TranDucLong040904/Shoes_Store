import React, { useEffect, useState } from "react";
import "./product.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import ProductSlider from "./productSlider/productSlider";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams } from "react-router-dom";
import {
  addToCart,
  getOneProduct,
  getReviews,
} from "../../service/productService";
import { toast } from "react-toastify";
import { convertBase64ToImage } from "../../assets/data/image";
import Review from "./Tabs/Review";
import ReviewComments from "./Tabs/ReviewComments";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/cartSlice";
import { getAllProductsInCart } from "../../utils/utils";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [getProduct, setGetProduct] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [listImage, setListImage] = useState([]);
  const [product, setProduct] = useState({
    userId: "",
    productId: "",
    sizeId: null,
    quantity: 1,
  });
  const [user, setUser] = useState({});
  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong Local Storage không
    const storedUser = localStorage.getItem("user");

    // Nếu có, chuyển đổi chuỗi JSON thành đối tượng và cập nhật state
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const getOnePrd = async () => {
    let res = await getOneProduct(id);
    if (res && res.errCode === 0) {
      setGetProduct(res.DT);
      setProduct({
        ...product,
        productId: parseInt(id),
      });
    } else {
      toast.error(res.errMessage);
    }
  };

  const getAllReviews = async () => {
    let res = await getReviews(id);
    if (res && res.errCode === 0) {
      setReviews(res.DT);
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    let list = [];
    list.push(convertBase64ToImage(getProduct?.image));
    getProduct?.images?.map((item) => {
      list.push(convertBase64ToImage(item));
    });
    setListImage(list);
  }, [getProduct]);

  useEffect(() => {
    getOnePrd();
    getAllReviews();
  }, [id]);

  const handleAddToCart = async () => {
    if (product?.quantity <= 0) {
      toast.error("Số lượng không hợp lệ");
      return;
    }
    if (product?.sizeId === null) {
      toast.error("Vui lòng chọn size");
      return;
    }

    console.log(user);
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    let res = await addToCart({
      userId: user?.id,
      productId: product?.productId,
      sizeId: product?.sizeId,
      quantity: product?.quantity,
    });
    if (res && res.errCode === 0) {
      toast.success("Thêm vào giỏ hàng thành công");
      getAllProductsInCart(user?.id, dispatch, toast);
    } else {
      toast.error(res.errMessage);
    }
  };
  const [active, setActive] = useState(1);

  const handleToggleClick = (id) => {
    setActive(id);
  };

  const handleOrder = async () => {
    if (product?.sizeId === null) {
      toast.error("Vui lòng chọn size");
      return;
    }
    if (product?.quantity <= 0) {
      toast.error("Số lượng không hợp lệ");
      return;
    }
    localStorage.setItem(
      "chooseProduct",
      JSON.stringify({
        ...getProduct,
        sizeId: product?.sizeId,
        quantity: product?.quantity,
      })
    );
    window.location.href = "/order";
  };

  console.log(getProduct);
  return (
    <>
      <Navbar />
      <div className="slider-product">
        <div className="product-content">
          <div className="product-show">
            <div className="slide-left">
              <div className="product-img">
                <ProductSlider images={listImage} />
              </div>
            </div>
            <div className="slide-right">
              <div className="product-content-right-name">
                <h2>{getProduct?.productName}</h2>
                <p>
                  Còn:{" "}
                  {product?.sizeId === null
                    ? getProduct?.inventory?.reduce(
                        (accumulator, currentValue) => {
                          return (
                            accumulator + parseInt(currentValue.quantityInStock)
                          );
                        },
                        0
                      )
                    : getProduct?.inventory?.filter(
                        (item) => product?.sizeId === item?.sizeId
                      )[0]?.quantityInStock}
                </p>
              </div>

              <div className="product-content-right-price">
                <p>
                  {/* {parseInt(getProduct?.price).toLocaleString("vi-VN")} */}
                  {Math.round(
                    parseInt(getProduct?.price) *
                      (getProduct?.discount
                        ? (100 - parseInt(getProduct?.discount)) / 100
                        : 1)
                  ).toLocaleString("vi-VN")}
                  <sup>đ</sup>
                </p>
              </div>

              <div className="product-content-right-size">
                <p style={{ fontWeight: "bold" }}>Size:</p>
                <div className="size">
                  {getProduct?.inventory
                    ?.sort((a, b) => a.sizeId - b.sizeId)
                    ?.filter((item) => item.quantityInStock > 0)
                    ?.map((item, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          setProduct({ ...product, sizeId: item?.sizeId });
                        }}
                        className={`border  ${
                          product?.sizeId === item?.sizeId
                            ? "border-black"
                            : "border-gray-400"
                        }`}
                      >
                        {item?.sizeId === 1
                          ? "36"
                          : item?.sizeId === 2
                          ? "37"
                          : item?.sizeId === 3
                          ? "38"
                          : item?.sizeId === 4
                          ? "39"
                          : item?.sizeId === 5
                          ? "40"
                          : item?.sizeId === 6
                          ? "41"
                          : "42"}
                      </span>
                    ))}
                </div>
              </div>

              <div className="quantity">
                <p style={{ fontWeight: "bold", marginBottom: "0px" }}>
                  Số lượng:
                </p>
                &nbsp;
                <div className="flex gap-3 qty-change">
                  <button
                    type="button"
                    className="flex items-center justify-center qty-dec fs-14"
                    onClick={() => {
                      if (product?.quantity <= 1) {
                        toast.error("Số lượng không hợp lệ");
                        return;
                      }
                      setProduct({
                        ...product,
                        total_money:
                          (product?.quantity - 1) * parseInt(getProduct.price),
                        quantity: product?.quantity - 1,
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 12h-15"
                      />
                    </svg>
                  </button>
                  <span className="flex qty-value flex-center">
                    {product?.quantity}
                  </span>
                  <button
                    type="button"
                    className="flex items-center justify-center qty-inc fs-14"
                    onClick={() => {
                      if (
                        product?.quantity >=
                        getProduct?.inventory?.find(
                          (item) => item?.sizeId === product?.sizeId
                        )?.quantityInStock
                      ) {
                        toast.error(
                          "Chỉ còn lại " + product?.quantity + " sản phẩm"
                        );
                        return;
                      }
                      setProduct({
                        ...product,
                        total_money:
                          (product?.quantity + 1) * parseInt(getProduct.price),
                        quantity: product?.quantity + 1,
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="product-content-right-button">
                <button
                  className="btn btn-lg button-cart add-cart"
                  onClick={() => {
                    handleAddToCart();
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  className="btn btn-lg button-cart buy-now"
                  onClick={() => {
                    handleOrder();
                  }}
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>

          <div className="desc col-12">
            <ul className="tabs">
              <li onClick={() => handleToggleClick(1)}>Description</li>
              <li onClick={() => handleToggleClick(2)}>Đánh giá</li>
            </ul>
          </div>

          <div className="content">
            <div
              className={
                active === 1 ? "content-desc content-active" : "content-none"
              }
              dangerouslySetInnerHTML={{
                __html: convertBase64ToImage(getProduct?.description),
              }}
            >
              {/* {convertBase64ToImage(getProduct?.description)} */}
            </div>

            <div
              className={
                active === 2 ? "content-review content-active" : "content-none"
              }
            >
              {!user?.id ? (
                <button className="px-4 py-2 text-white bg-red-500 rounded-md">
                  Vui lòng đăng nhập để đánh giá
                </button>
              ) : (
                <Review productId={id} userId={user?.id} />
              )}
              {/* <Review /> */}
              <ReviewComments reviews={reviews} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetails;
