import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import "./ManageNotification.scss";
import { Table } from "react-bootstrap";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { ModalNotification } from "../../components";
import axios from "../../axios";
const ManageNotification = () => {
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState([]);
  const fetchNotification = async () => {
    const res = await axios.get(`/api/v1/getnoti`);
    setNotification(res);
  };

  useEffect(() => {
    fetchNotification();
  }, []);
  const handleClose = () => {
    setShowModal(false);
  };
  console.log(notification);
  return (
    <div className="manage-notification">
      <Nav />
      <div className="content">
        {" "}
        <Table bordered hover>
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Nội dung</th>
              <th>Ngày hủy</th>
              {/* <th>Hành Động</th> */}
            </tr>
          </thead>
          <tbody>
            {notification?.length > 0 &&
              notification?.map((item) => {
                const products = item?.content.split("\n");
                // Tạo đối tượng Date từ chuỗi thời gian
                const dateTime = new Date(item?.createdAt);

                // Lấy thông tin ngày và giờ
                const date = dateTime.toLocaleDateString(); // Format ngày
                const time = dateTime.toLocaleTimeString(); // Format giờ
                return (
                  <tr key={item?.id}>
                    <td>
                      <ul>
                        <li>{item?.name}</li>
                        <li>{item?.email}</li>
                        <li>SĐT: {item?.phone}</li>
                      </ul>
                    </td>
                    <td>
                      <p>{`Đơn hàng đã bị hủy: ${
                        products.length > 0 ? "" : "Không có sản phẩm"
                      }`}</p>
                      {products.map((product, index) => (
                        <p key={index}>{product}</p>
                      ))}
                    </td>
                    <td>
                      {date} {time}
                    </td>
                    {/* <td>
                      <button
                        className="mx-3 btn btn-primary"
                        onClick={() => setShowModal(true)}
                      >
                        <BiEdit />
                      </button>
                      <button className="btn btn-danger">
                        <AiFillDelete />
                      </button>
                    </td> */}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>

      {/* <ModalNotification show={showModal} handleClose={handleClose} /> */}
    </div>
  );
};

export default ManageNotification;
