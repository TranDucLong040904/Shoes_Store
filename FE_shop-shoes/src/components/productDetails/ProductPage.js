import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import "./ProductPage.scss";
import ReactPaginate from "react-paginate";
import Footer from "../footer/Footer";
// import Input from "../../assets/Input";
import { Swiper, SwiperSlide } from "swiper/react";
import shoe01 from "../../assets/images/sieu-sale-4.4-cata-1140x500.png";
import shoe02 from "../../assets/images/banner02.jpg";
import shoe03 from "../../assets/images/banner03.jpg";
import shoe04 from "../../assets/images/banner04.jpg";
import { getAllProduct } from "../../service/productService";
import { toast } from "react-toastify";
import ItemProductCart from "../card/ItemProductCart";
import { fetchAllSupplierNoLimit } from "../../service/userService";
import Input from "../../assets/Input";

const priceRanges = [
  { value: 500, title: "500.000₫", minPrice: 0, maxPrice: 500000 },
  {
    value: 1000,
    title: "500.000₫ - 1.000.000₫",
    minPrice: 500000,
    maxPrice: 1000000,
  },
  {
    value: 2000,
    title: "1.000.000₫ - 2.000.000₫",
    minPrice: 1000000,
    maxPrice: 2000000,
  },
  {
    value: 3000,
    title: "2.000.000₫ - 3.000.000₫",
    minPrice: 2000000,
    maxPrice: 3000000,
  },
  {
    value: 4000,
    title: "3.000.000₫ - 4.000.000₫",
    minPrice: 3000000,
    maxPrice: 4000000,
  },
  {
    value: 4000,
    title: "> 4.000.000₫",
    minPrice: 4000000,
    maxPrice: 100000000,
  },
  // Thêm các khoảng giá khác nếu cần
];

const ProductPage = () => {
  const slug = window.location.pathname.split("/")[2];

  const [listSupplier, setListSupplier] = useState([]);
  const [getProduct, setGetProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [supplierActive, setSupplierActive] = useState("");
  const [filterPrice, setFilterPrice] = useState([0, 0]);
  const [filterSize, setFilterSize] = useState([]);
  const getAllProducts = async () => {
    let res = await getAllProduct(
      currentPage,
      currentLimit,
      supplierActive,
      filterPrice[0],
      filterPrice[1],
      filterSize.join(",")
    );
    if (res && res.errCode === 0) {
      setGetProduct(res?.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
      console.log("Get data: ", supplierActive);
    } else {
      toast.error(res.errMessage);
    }
  };
  //fetch supplier
  const fetchSupplier = async () => {
    let res = await fetchAllSupplierNoLimit();
    if (res && res.errCode === 0) {
      setListSupplier(res.DT);
    }
  };

  useEffect(() => {
    if (slug) {
      setSupplierActive(slug);
    }
  }, [slug]);
  useEffect(() => {
    fetchSupplier();
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [currentPage, supplierActive, filterPrice, filterSize]);

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handlePriceChange = (minPrice, maxPrice) => {
    setFilterPrice([minPrice, maxPrice]);
  };

  const handleFilterSize = (size) => {
    if (filterSize?.includes(size)) {
      setFilterSize(filterSize.filter((item) => item !== size));
    } else {
      setFilterSize([...filterSize, size]);
    }
  };

  console.log(filterSize);

  return (
    <>
      <Navbar />
      <div div className="product-page">
        <div className="page">
          <div className="page-left">
            <div className="category">
              <h4>THƯƠNG HIỆU</h4>
              <ul>
                {listSupplier?.length > 0 &&
                  listSupplier?.map((item, index) => (
                    <li
                      key={item?.id}
                      className={`${
                        supplierActive === item?.name
                          ? "scale-125 text-[#c72092]"
                          : "scale-100"
                      } capitalize`}
                      onClick={() => {
                        if (supplierActive === item?.name) {
                          setSupplierActive("");
                        } else {
                          setSupplierActive(item?.name);
                        }
                      }}
                    >
                      {item?.name}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="price">
              <h4>GIÁ</h4>
              <ul>
                {priceRanges.map((range) => (
                  <Input
                    key={range.value}
                    value={range.value}
                    title={range.title}
                    name="price"
                    handleChange={() =>
                      handlePriceChange(range.minPrice, range.maxPrice)
                    }
                  />
                ))}

                {/* <li>
                  <input type="radio" />
                  <span>500.000₫ - 1.000.000₫</span>
                </li>
                <li>
                  <input type="radio" />
                  <span>500.000₫ - 1.000.000₫</span>
                </li>
                <li>
                  <input type="radio" />
                  <span>500.000₫ - 1.000.000₫</span>
                </li> */}
              </ul>
            </div>
            <div className="size">
              <h4>SIZE</h4>
              <ul>
                <li className="">
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleFilterSize(1);
                    }}
                  />
                  <span>36</span>
                </li>
                <li className="">
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleFilterSize(2);
                    }}
                  />
                  <span>37</span>
                </li>
                <li className="">
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleFilterSize(3);
                    }}
                  />
                  <span>38</span>
                </li>
                <li className="">
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleFilterSize(4);
                    }}
                  />
                  <span>39</span>
                </li>
                <li className="">
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleFilterSize(5);
                    }}
                  />
                  <span>40</span>
                </li>
                <li className="">
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleFilterSize(6);
                    }}
                  />
                  <span>41</span>
                </li>
                <li className="">
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleFilterSize(7);
                    }}
                  />
                  <span>42</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="page-right">
            <div className="banner">
              <Swiper>
                <SwiperSlide>
                  <img src={shoe01} alt="" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={shoe02} alt="" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={shoe03} alt="" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={shoe04} alt="" />
                </SwiperSlide>
              </Swiper>
            </div>
            {getProduct?.length > 0 ? (
              <div>
                <div className="product-list">
                  {getProduct?.length > 0 &&
                    getProduct?.map((item, index) => {
                      return (
                        <ItemProductCart
                          item={item}
                          key={index}
                        ></ItemProductCart>
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
            ) : (
              <div className="flex items-center justify-center mt-8">
                <p>Không có sản phẩm nào tồn tại....</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
