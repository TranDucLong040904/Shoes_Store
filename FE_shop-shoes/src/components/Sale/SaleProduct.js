import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import "./Sale.scss";
import { Link } from "react-router-dom";
import shoe1 from "../../assets/images/nike02.jpeg";
import nike from "../../assets/images/Giay-Air-Jordan-1-Retro-Hi-Premium-GS-Camo-822858-027.jpg";
import Footer from "../footer/Footer";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { getProductSale } from "../../service/productService";
import ItemProductCart from "../card/ItemProductCart";

const SaleProduct = () => {
  const [getAllProductsSell, setGetAllProductsSell] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const getAllProducts = async () => {
    let res = await getProductSale(currentPage, currentLimit);
    if (res && res.errCode === 0) {
      setGetAllProductsSell(res?.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
  };
  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };
  useEffect(() => {
    getAllProducts();
  }, [currentPage]);

  return (
    <>
      <Navbar />
      <div className="sale-product">
        <div className="list">
          {getAllProductsSell?.length > 0 &&
            getAllProductsSell?.map((item, index) => {
              return (
                <ItemProductCart item={item} key={index}></ItemProductCart>
              );
            })}
        </div>
        <div className="paginate">
          <ReactPaginate
            breakLabel="..."
            nextLabel=" >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={4}
            pageCount={totalPages}
            previousLabel="< "
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SaleProduct;
