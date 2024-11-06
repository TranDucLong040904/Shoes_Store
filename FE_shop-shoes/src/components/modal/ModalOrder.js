import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./ModalOrder.scss";
import { Table } from "react-bootstrap";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ModalOrder = (props) => {
  const { show, handleClose, valueModal } = props;
  const [loader, setLoader] = useState(false);

  console.log(valueModal);

  const downloadPDF = () => {
    const capture = document.querySelector(".order-detail");
    setLoader(true);
    html2canvas(capture, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("img/png");
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const doc = new jsPDF("p", "mm", "a4");
      // const componentWidth = doc.internal.pageSize.getWidth();
      // const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      setLoader(false);
      doc.save("hoadon.pdf");
    });
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl" className="modal-order">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Chi tiết đơn hàng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="order-detail">
            <div className="info">
              <div className="info-ncc">
                <h5>Người gửi</h5>
                <ul>
                  <li>
                    Cửa hàng: <b>Shopshoes</b>
                  </li>
                  <li>Tầng 2 - Số 2 -Ngõ 80</li>
                  <li>
                    Phố Thành Trung -Trâu Quỳ -Gia Lâm -Hà NộiGia Lâm -Hà Nội
                  </li>
                  <li>Phone: 1234567890</li>
                  <li>Email: support@shopshoes.com</li>
                </ul>
              </div>
              <div className="info-customer">
                <h5>Người nhận</h5>
                <ul>
                  <strong>{valueModal?.username}</strong>
                  <li>{valueModal?.addressDetail}</li>
                  <li>
                    {valueModal?.ward} - {valueModal?.district} -{" "}
                    {valueModal?.province}
                  </li>
                  <li>Phone: {valueModal?.phone}</li>
                  <li>Email: {valueModal?.email}</li>
                </ul>
              </div>
              <div className="info-delivery">
                <h5>Thông tin giao dịch</h5>
                <ul>
                  <li>Mã đơn hàng: {valueModal?.id}</li>
                  <li>Thanh toán: nhận hàng</li>
                  <li>
                    Phí vận chuyển:{" "}
                    {valueModal?.deliveryType === "FAST" ? "65.000" : "45.000"}đ
                  </li>
                </ul>
              </div>
            </div>
            <div className="product-order">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    {/* <th>Trạng Thái</th> */}
                  </tr>
                </thead>
                <tbody>
                  {valueModal?.orderDetail?.length > 0 &&
                    valueModal?.orderDetail?.map((item, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <ul>
                            <li>{item?.product?.productName}</li>
                            <li>Size: {item?.size}</li>
                          </ul>
                        </td>
                        <td>{item?.quantity}</td>
                        <td>
                          {parseInt(item?.price).toLocaleString("vi-VN")}đ
                        </td>
                        {/* <td>
                          <select className="form-select">
                            <option>Chờ xử lý</option>
                            <option>Đã duyệt</option>
                            <option>Đang giao hàng</option>
                            <option>Đã Giao hàng</option>
                          </select>
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </Table>
              <div className="total-money">
                Tổng:{" "}
                {(
                  (valueModal?.orderDetail?.length > 0 &&
                    valueModal?.orderDetail?.reduce(
                      (acc, cur) =>
                        acc + parseInt(cur?.price) * parseInt(cur?.quantity),
                      0
                    )) +
                  parseInt(valueModal?.deliveryType === "FAST" ? 65000 : 45000)
                ).toLocaleString("vi-VN")}
                đ
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={props.onHide}>Lưu</Button> */}
          <Button onClick={downloadPDF} disabled={!(loader === false)}>
            {loader ? <span>Downloading</span> : <span>Download</span>}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalOrder;
