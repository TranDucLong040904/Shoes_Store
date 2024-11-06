import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import "./ManageUser.scss";
import { Button, Table } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit, BiMenuAltLeft } from "react-icons/bi";
import { toast } from "react-toastify";
import {
  createCustomer,
  deleteUser,
  editCustomer,
  getCustomer,
  getOneCustomer,
} from "../../service/userService";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

const ManageCustomer = () => {
  const [edit, setEdit] = useState(false); // [1
  const [show, setShow] = useState(false);
  const [sortByName, setSortByName] = useState(false);
  const [values, setValues] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    addressDetails: "",
    password: "",
    roleId: "STAFF",
  });

  const [getAllCustomer, setGetAllCustomer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const getAllCustomers = async () => {
    let res = await getCustomer(currentPage, currentLimit, sortByName);
    if (res && res.errCode === 0) {
      setGetAllCustomer(res.DT?.suppliers);

      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, [show, currentPage, sortByName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value.trim() });
  };

  const getOneStaff = async (id) => {
    let res = await getOneCustomer(id);
    if (res && res.errCode === 0) {
      console.log(res.DT);
      setValues({
        id: res?.DT?.id,
        username: res?.DT?.username,
        email: res?.DT?.email,
        phone: res?.DT?.phone,
        addressDetails: res?.DT?.addressDetails || "",
        password: res?.DT?.password,
        roleId: res?.DT?.roleId,
      });
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.username) {
      toast.error("Vui lòng nhập tên người dùng");
      return;
    }
    if (!values.email) {
      toast.error("Vui lòng nhập email");
      return;
    }
    if (!values.phone) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!values.addressDetails) {
      toast.error("Vui lòng nhập địa chỉ");
      return;
    }
    if (!values.password && !edit) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      const res = !edit
        ? await createCustomer(values)
        : await editCustomer(values);
      if (res && res.errCode === 0) {
        toast.success("Thành công");
      } else {
        toast.error(res.errMessage);
      }
      setShow(false);
      setValues({
        username: "",
        email: "",
        phone: "",
        addressDetails: "",
        password: "",
        roleId: "STAFF",
      });
    } catch (error) {
      console.log("error: ", error);
      toast.error("Thất bại");
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
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
          await deleteUser(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          setGetAllCustomer(
            getAllCustomer.filter((customer) => customer.id !== id)
          );
        } catch (e) {
          Swal.fire("Error", e, "error");
        }
      }
    });
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  console.log(values);
  return (
    <div className="manage-user auto">
      <div
        className={`${
          show ? "opacity-100 visible" : "opacity-0 invisible"
        } fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50`}
        onClick={() => setShow(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-[50%] h-[50%] text-black rounded-md flex items-center justify-center"
        >
          <div className="grid grid-cols-2 gap-[5%] px-[5%] w-full">
            <div className="flex items-center justify-center col-span-2 mb-3">
              <h2 className="">{edit ? "Sửa nhân viên" : "Thêm nhân viên"}</h2>
            </div>
            <input
              type="text"
              className="col-span-1 px-3 py-1 border border-[#cccc] rounded-md"
              name="username"
              value={values?.username}
              placeholder="Nhập tên..."
              onChange={handleChange}
            />

            <input
              type="text"
              className="w-full px-3 py-1 border border-[#cccc] rounded-md"
              name="email"
              value={values?.email}
              placeholder="Nhập email..."
              onChange={handleChange}
            />
            <input
              type="text"
              className="w-full px-3 py-1 border border-[#cccc] rounded-md"
              name="phone"
              value={values?.phone}
              placeholder="Nhập điện thoại..."
              onChange={handleChange}
            />
            <input
              type="text"
              className="w-full px-3 py-1 border border-[#cccc] rounded-md"
              name="addressDetails"
              value={values?.addressDetails}
              placeholder="Nhập địa chỉ..."
              onChange={handleChange}
            />
            <input
              type="password"
              className="w-full px-3 py-1 border border-[#cccc] rounded-md"
              name="password"
              disabled={edit}
              value={values.password}
              placeholder="Nhập password..."
              onChange={handleChange}
            />
            <select
              name="roleId"
              id="roleId"
              defaultChecked={values.roleId}
              className="w-full px-3 py-1 border border-[#cccc] rounded-md"
              value={values.roleId}
              onChange={handleChange}
            >
              <option value="STAFF">Nhân viên</option>
              <option value="ADMIN">Admin</option>
            </select>
            <div className="flex items-center justify-center col-span-2 mt-3">
              <button
                className="px-6 py-2 text-white bg-blue-500 rounded-lg"
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                {edit ? "Sửa" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Nav />
      <div className="content-user">
        <div className="title-user">
          <div
            onClick={() => {
              setValues({
                username: "",
                email: "",
                phone: "",
                addressDetails: "",
                password: "",
                roleId: "STAFF",
              });
              setShow(true);
              setEdit(false);
            }}
            className="add-user"
          >
            <Button>
              <i className="fa-solid fa-circle-plus"></i> Tạo tài khoản
            </Button>
          </div>
          <div
            className="filter-user"
            style={{ color: "black" }}
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
              <th>STT</th>
              <th>Họ Tên </th>
              <th>Email</th>
              <th>Phone</th>
              <th>Chức vụ</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {getAllCustomer?.length > 0 &&
              getAllCustomer?.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>
                      {currentPage * currentLimit - currentLimit + index + 1}
                    </td>
                    <td>{item?.username}</td>
                    <td>{item?.email}</td>
                    <td>{item?.phone}</td>
                    <td>{item?.roleId === "STAFF" ? "Nhân viên" : "Admin"}</td>
                    <td>{item?.status}</td>
                    <td>
                      <button
                        className="mx-3 btn btn-primary"
                        onClick={() => {
                          getOneStaff(item?.id);
                          setShow(true);
                          setEdit(true);
                        }}
                      >
                        <BiEdit />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(item?.id);
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
    </div>
  );
};

export default ManageCustomer;
