import React, { useEffect, useState } from "react";
import "./Selling.scss";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { getBestSellerProduct } from "../../service/productService";
import { toast } from "react-toastify";
// import ItemProductCart from "../card/ItemProductCart";
import { convertBase64ToImage } from "../../assets/data/image";

const SellingProducts = () => {
  var settings = {
    // dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    // initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [getProduct, setGetProduct] = useState([]);
  const [customSetting, setCustomSetting] = useState(settings);

  const getAllProductBestSale = async () => {
    let res = await getBestSellerProduct(1, 8);
    if (res && res.errCode === 0) {
      setGetProduct(res?.DT);
      setCustomSetting({
        ...customSetting,
        slidesToShow: res?.DT?.length > 4 ? 4 : res?.DT?.length,
      });
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    getAllProductBestSale();
  }, []);
  console.log(getProduct);
  return (
    <div className="sell-products">
      <div className="slide-product">
        <Slider {...customSetting}>
          {getProduct?.length > 0 &&
            getProduct?.map((item, index) => {
              return (
                <div className="list-none list" key={index}>
                  <div className="list-item">
                    <div className="cart-shopping">
                      <i className="fa-solid fa-cart-shopping"></i>
                    </div>
                    <div className="image">
                      <Link to={`/product-details/${item?.product?.id}`}>
                        <img
                          src={convertBase64ToImage(item?.product?.image)}
                          alt=""
                          className="aspect-[14/15] object-cover"
                        />
                      </Link>
                    </div>
                    <div className="list-desc">
                      <p>{item?.product?.productName}</p>
                    </div>
                    <div className="price">
                      {item?.product?.discount > 0 ? (
                        <div>
                          <span className="price-new">
                            {Math.round(
                              parseInt(item?.product?.price) *
                                ((100 - parseInt(item?.product?.discount)) /
                                  100)
                            ).toLocaleString("vi-VN")}
                            đ
                          </span>
                          <span className="price-old">
                            {parseInt(item?.product?.price).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="price-new">
                            {parseInt(item?.product?.price).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </Slider>
      </div>
    </div>
  );
};

export default SellingProducts;

// <div className="list-none list-item" key={index}>
// <div className="image">
//   <Link to={`/product-details/${item?.product?.id}`}>
//     <img
//       src={convertBase64ToImage(item?.product?.image)}
//       alt=""
//       className="aspect-[14/15] object-cover"
//     />
//   </Link>
// </div>
// <div className="list-desc">
//   <p>{item?.product?.productName}</p>
// </div>
// <div className="price">
//   {item?.product?.discount > 0 ? (
//     <div>
//       <span className="price-new">
//         {Math.round(
//           parseInt(item?.product?.price) *
//             ((100 - parseInt(item?.product?.discount)) / 100)
//         ).toLocaleString("vi-VN")}
//         đ
//       </span>
//       <span className="price-old">
//         {parseInt(item?.product?.price).toLocaleString(
//           "vi-VN"
//         )}
//         đ
//       </span>
//     </div>
//   ) : (
//     <div>
//       <span className="price-new">
//         {parseInt(item?.product?.price).toLocaleString(
//           "vi-VN"
//         )}
//         đ
//       </span>
//     </div>
//   )}
// </div>
// </div>
