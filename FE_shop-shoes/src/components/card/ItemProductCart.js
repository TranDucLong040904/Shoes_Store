import React from "react";
import { Link } from "react-router-dom";
import { convertBase64ToImage } from "../../assets/data/image";

const ItemProductCart = ({ item, index }) => {
  return (
    <div className="list-none list-item" key={index}>
      <div className="image">
        <Link to={`/product-details/${item?.id}`}>
          <img
            src={convertBase64ToImage(item?.image)}
            alt=""
            className="aspect-[14/15] object-cover"
          />
        </Link>
      </div>
      <div className="list-desc">
        <p>{item.productName}</p>
      </div>
      <div className="price">
        {item?.discount > 0 ? (
          <div>
            <span className="price-new">
              {Math.round(
                parseInt(item?.price) * ((100 - parseInt(item?.discount)) / 100)
              ).toLocaleString("vi-VN")}
              đ
            </span>
            <span className="price-old">
              {parseInt(item?.price).toLocaleString("vi-VN")}đ
            </span>
          </div>
        ) : (
          <div>
            <span className="price-new">
              {parseInt(item?.price).toLocaleString("vi-VN")}đ
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemProductCart;
