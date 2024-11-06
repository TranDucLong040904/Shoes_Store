import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import "./Customer.scss";
import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
// import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { deleteUser, getUser } from "../../service/userService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ManageUser = () => {
  const [getAllUser, setGetAllUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  const [sortByName, setSortByName] = useState(false);
  const getAllUsers = async () => {
    let res = await getUser(currentPage, currentLimit);
    if (res && res.errCode === 0) {
      setGetAllUser(res.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [currentPage]);

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
          setGetAllUser(getAllUser.filter((customer) => customer.id !== id));
        } catch (e) {
          Swal.fire("Error", e, "error");
        }
      }
    });
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  return (
    <div className="manage-customer auto">
      <Nav />
      <div className="content-customer">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ Tên </th>
              <th>Email</th>
              <th>Phone</th>
              <th>Chức vụ</th>
              {/* <th>Trạng Thái</th> */}
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {getAllUser?.length > 0 &&
              getAllUser?.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>
                      {currentPage * currentLimit - currentLimit + index + 1}
                    </td>
                    <td>{item?.username}</td>
                    <td>{item?.email}</td>
                    <td>{item?.phone}</td>
                    <td>{item?.roleId}</td>
                    {/* <td>{item?.status}</td> */}
                    <td>
                      {/* <button
                        className="mx-3 btn btn-primary"
                        onClick={() => {
                          getOneStaff(item?.id);
                          setShow(true);
                          setEdit(true);
                        }}
                      >
                        <BiEdit />
                      </button> */}
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

export default ManageUser;
