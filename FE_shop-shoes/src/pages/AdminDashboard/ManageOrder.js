import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import "./ManageOrder.scss";
import { Table } from "react-bootstrap";
import { FaMoneyBillAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { BiEdit, BiMenuAltLeft } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { ModalOrder } from "../../components";
import {
  deleteOrder,
  getAllOrder,
  getDataManageAdmin,
  updateOrder,
} from "../../service/productService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { cloneDeep, debounce } from "lodash";

const ManageOrder = () => {
  const [isShowModalOrder, setIsShowModalOrder] = useState(false);
  const [valueModal, setValueModal] = useState({});
  const [dataManage, setDataManage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortByName, setSortByName] = useState(false);

  const fectchDtManage = async () => {
    let res = await getDataManageAdmin();
    if (res && res.errCode === 0) {
      setDataManage(res.DT);
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleEditOrder = (product) => {
    setIsShowModalOrder(true);
    setValueModal(product);
  };

  const handleClose = () => {
    setIsShowModalOrder(false);
  };

  const handleClick = () => {
    alert("Mã đơn hàng");
  };

  const [getOrders, setGetOrders] = useState([]);
  const getAllOrders = async () => {
    let res = await getAllOrder(currentPage, currentLimit, sortByName);
    if (res && res.errCode === 0) {
      setGetOrders(res.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
    console.log("Check: ", res);
  };

  const handleUpdateOrder = async (id, value) => {
    console.log(id);
    let res = await updateOrder(id, { status: value });
    if (res && res.errCode === 0) {
      toast.success("Cập nhật thành công");
      fectchDtManage();
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    fectchDtManage();
  }, []);
  useEffect(() => {
    getAllOrders();
  }, [currentPage, sortByName]);

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleSearch = debounce((event) => {
    let term = event.target.value;
    if (term) {
      let searchData = cloneDeep(getOrders);

      searchData = searchData.filter((item) => item.email.includes(term));
      setGetOrders(searchData);
    } else {
      getAllOrders(currentPage);
    }
  }, 100);

  // console.log(getOrders);
  return (
    <div className="manage-order">
      <Nav />
      <div className="main-order">
        <div className="main-card">
          <div className="card">
            <div className="card-inner">
              <h3>Đơn đặt hàng</h3>
              <FaMoneyBillAlt className="card_icon" />
            </div>
            <h1>{dataManage?.totalOrders}</h1>
          </div>

          <div className="card">
            <div className="card-inner">
              <h3>Đơn chờ duyệt</h3>
              <FaMoneyBillAlt className="card_icon" />
            </div>
            <h1>{dataManage?.totalOrdersPending}</h1>
          </div>

          <div className="order-search">
            Searh:
            <input
              type="text"
              onChange={(event) => handleSearch(event)}
              placeholder="tìm kiếm"
            />
          </div>
        </div>
        <div className="content-order">
          <div className="title-order">
            <h3>Đơn hàng đang xử lý</h3>
            <div
              className="filter-order"
              onClick={() => {
                setSortByName(!sortByName);
              }}
            >
              Lọc
              <BiMenuAltLeft />
            </div>
          </div>

          <Table bordered hover>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Khách hàng</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Ngày Đặt</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {getOrders?.length > 0 &&
                getOrders?.map((item, index) => {
                  const createdAtDate = new Date(item?.createdAt);
                  const formattedDate = `${createdAtDate.getDate()}/${
                    createdAtDate.getMonth() + 1
                  }/${createdAtDate.getFullYear()} ${createdAtDate.getHours()}:${
                    createdAtDate.getMinutes() < 10
                      ? "0" + createdAtDate.getMinutes()
                      : createdAtDate.getMinutes()
                  }`;
                  return (
                    <tr key={item?.id}>
                      <td className="code-order">
                        <button onClick={handleClick}>#{item?.id}</button>
                      </td>
                      <td>{item?.username}</td>
                      <td>{item?.email}</td>
                      <td>{item?.phone}</td>
                      <td>{formattedDate}</td>
                      <td>
                        <select
                          name="status"
                          id="status"
                          disabled={
                            item?.status === "SUCCESS" ||
                            item?.status === "CANCEL"
                          }
                          className="w-full h-[100%] border-none outline-none"
                          // value={item?.status}
                          defaultValue={item?.status}
                          onChange={(e) => {
                            handleUpdateOrder(item?.id, e.target.value);
                          }}
                        >
                          <option value="PENDING">Chờ xác nhận</option>
                          <option value="CONFIRM">Chờ lấy hàng</option>
                          <option value="SHIPPING">Đang giao hàng</option>
                          <option value="SUCCESS">Đã giao</option>
                          <option value="CANCEL">Đã Hủy</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="mx-3 btn btn-primary"
                          onClick={() => handleEditOrder(item)}
                        >
                          <BiEdit />
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={async () => {
                            // await deleteOrder(item?.id);
                            // fectchDtManage();
                            // setGetOrders(
                            //   getOrders.filter((x) => x.id !== item.id)
                            // );

                            Swal.fire({
                              title: "Bạn có muốn xóa?",
                              text: "Đơn hàng có thể xóa vĩnh viễn!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes, delete it!",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                try {
                                  await deleteOrder(item?.id);
                                  fectchDtManage();
                                  setGetOrders(
                                    getOrders.filter((x) => x.id !== item.id)
                                  );
                                  Swal.fire(
                                    "Deleted!",
                                    "Your file has been deleted.",
                                    "success"
                                  );
                                } catch (e) {
                                  Swal.fire("Error", e, "error");
                                }
                              }
                            });
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
        <ModalOrder
          show={isShowModalOrder}
          handleClose={handleClose}
          valueModal={valueModal}
        />
      </div>
    </div>
  );
};

export default ManageOrder;
