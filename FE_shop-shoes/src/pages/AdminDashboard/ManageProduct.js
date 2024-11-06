import React, { useEffect, useState } from "react";
import "./ManageProduct.scss";
import Nav from "./Nav";
import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { deleteProduct, getAllProduct } from "../../service/productService";
import { toast } from "react-toastify";
import { convertBase64ToImage } from "../../assets/data/image";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import _, { cloneDeep, debounce } from "lodash";
import { fetchAllSupplierNoLimit } from "../../service/userService";

const ManageProduct = () => {
  const [getProduct, setGetProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [listBrand, setListBrand] = useState([]);
  const [supplierSort, setSupplierSort] = useState("");
  const [search, setSearch] = useState("");

  const getAllProducts = async () => {
    let res = await getAllProduct(
      currentPage,
      currentLimit,
      supplierSort,
      "",
      "",
      "1,2,3,4,5,6,7",
      search
    );
    if (res && res.errCode === 0) {
      setGetProduct(res?.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
    console.log("Check data: ", getProduct);
  };

  useEffect(() => {
    getAllProducts();
  }, [currentPage, search, supplierSort]);

  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          setGetProduct(getProduct.filter((product) => product.id !== id));
        } catch (e) {
          Swal.fire("Error", e, "error");
        }
      }
    });
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  // const handleProductSearch = debounce((event) => {
  //   let search = event.target.value;
  //   if (search) {
  //     let productSearch = cloneDeep(getProduct);

  //     productSearch = productSearch.filter((item) =>
  //       item.productName.toLowerCase().includes(_.toLower(search))
  //     );
  //     setGetProduct(productSearch);
  //   } else {
  //     getAllProducts(currentPage);
  //   }
  // });

  const fetchBrand = async () => {
    const res = await fetchAllSupplierNoLimit();
    if (res && res.errCode === 0) {
      setListBrand(res.DT);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, []);

  // const slug = window.location.pathname.split("/")[2];

  // useEffect(() => {
  //   if (slug) {
  //     setSupplierSort(slug);
  //   }
  // }, [slug]);

  // const handleProductSort = (value, name) => {
  //   let _dataProduct = _.cloneDeep(supplierSort);
  //   _dataProduct[name] = value;
  //   setSupplierSort(_dataProduct);
  // };

  return (
    <div className="manage-product auto">
      <Nav />
      <div className="content-product">
        <div className="product-search">
          <div className="product__filter">
            <h5>Search:</h5>
            <input
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="tìm kiếm"
            />
          </div>
          <div className="product__sort">
            <h5>Lọc</h5>
            <select
              className="sort__band"
              // value={supplierSort}
              onChange={(e) => setSupplierSort(e.target.value)}
            >
              <option value="default" disabled selected>
                --- chọn ---
              </option>
              {listBrand?.length > 0 &&
                listBrand?.map((item, index) => {
                  return (
                    <option
                      key={item?.id}
                      value={item?.name}
                      // onClick={() => setSupplierSort(item?.name)}
                    >
                      {item?.name}
                    </option>
                  );
                })}
              {/* <option value="CANCEL">Đã Hủy</option> */}
            </select>
          </div>
        </div>

        <Table bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên </th>
              <th>Ảnh</th>
              <th>Giá</th>
              <th>Giảm giá(%)</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {getProduct?.length > 0 &&
              getProduct?.map((item, index) => {
                return (
                  <tr key={item?.id}>
                    <td>
                      {currentPage * currentLimit - currentLimit + index + 1}
                    </td>
                    <td>{item?.productName}</td>
                    <td>
                      <img
                        src={convertBase64ToImage(item?.image)}
                        alt=""
                        style={{
                          height: "100px",
                          width: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{item?.price}đ</td>
                    <td>{item?.discount}</td>
                    <td>
                      {item?.inventories?.reduce(
                        (accumulator, currentValue) => {
                          return (
                            accumulator + parseInt(currentValue.quantityInStock)
                          );
                        },
                        0
                      )}
                    </td>
                    <td>
                      <NavLink
                        to={`/admin/edit-product/${item?.id}`}
                        className="mx-3 btn btn-primary"
                      >
                        <BiEdit />
                      </NavLink>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          handleDeleteProduct(item?.id);
                        }}
                      >
                        <AiFillDelete />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <nav
          className="pageination is-centered"
          // key={currentPage}
          role="navigation"
          aria-label="pagination"
        >
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
        </nav>
      </div>
    </div>
  );
};

export default ManageProduct;
