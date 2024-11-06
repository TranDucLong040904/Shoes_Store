import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { Button, Table } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit, BiMenuAltLeft } from "react-icons/bi";
import ReactPaginate from "react-paginate";
import { ModalDeleteSupplier, ModalSupplier } from "../../components";
import { deleteSupplier, fetchAllSupplier } from "../../service/userService";
import { toast } from "react-toastify";

const Supplier = () => {
  //create
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [sortByName, setSortByName] = useState(false);

  const [dataModal, setDataModal] = useState({});
  const [actionModal, setActionModal] = useState("CREATE");
  const [dataModalEdit, setDataModalEdit] = useState({});

  const [listSupplier, setListSupplier] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // const handleAddSupplier = () => {
  //   setIsShowModal(true);
  // };

  useEffect(() => {
    fetchSupplier();
  }, [currentPage, sortByName]);

  const fetchSupplier = async () => {
    let res = await fetchAllSupplier(currentPage, currentLimit, sortByName);
    if (res && res.errCode === 0) {
      setTotalPages(res.DT.totalPages);
      setListSupplier(res.DT.suppliers);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleDeleteSupplier = async (supplier) => {
    setDataModal(supplier);
    setIsShowModalDelete(true);
  };

  const onHideModal = async () => {
    setIsShowModal(false);
    setIsShowModalDelete(false);
    setDataModal({});
    setDataModalEdit({});
    await fetchSupplier();
  };

  const comfirmDeleteSupplier = async () => {
    let res = await deleteSupplier(dataModal);
    if (res && res.errCode === 0) {
      toast.success(res.errMessage);
      await fetchSupplier();
      setIsShowModalDelete(false);
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleEditSupplier = (supplier) => {
    setActionModal("UPDATE");
    setDataModalEdit(supplier);
    setIsShowModal(true);
  };

  return (
    <div className="manage-user auto">
      <Nav />
      <div className="content-user">
        <div className="title-user">
          <div className="add-user">
            <Button
              onClick={() => {
                setIsShowModal(true);
                setActionModal("CREATE");
              }}
            >
              <i className="fa-solid fa-circle-plus"></i> Thêm
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
              <th>#</th>
              <th>Tên nhà cung cấp</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Địa chỉ</th>

              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {listSupplier && listSupplier.length > 0 ? (
              <>
                {listSupplier.map((item, index) => {
                  return (
                    <tr key={`row-${index}`}>
                      {/* <td>{index + 1}</td> */}
                      <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>

                      <td>
                        <button
                          className="mx-3 btn btn-primary"
                          onClick={() => handleEditSupplier(item)}
                        >
                          <BiEdit />
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteSupplier(item)}
                        >
                          <AiFillDelete />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <>
                <tr>
                  <td>Không có dữ liệu</td>
                </tr>
              </>
            )}
          </tbody>
        </Table>
        {totalPages > 0 && (
          <div className="footer">
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
        )}
      </div>
      <ModalSupplier
        show={isShowModal}
        onHide={onHideModal}
        action={actionModal}
        dataModal={dataModalEdit}
      />
      <ModalDeleteSupplier
        show={isShowModalDelete}
        onHide={onHideModal}
        comfirmDeleteSupplier={comfirmDeleteSupplier}
        dataModal={dataModal}
      />
    </div>
  );
};

export default Supplier;
