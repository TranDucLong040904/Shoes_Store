import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalDeleteSupplier = (props) => {
  const { show } = props;

  return (
    <>
      <Modal show={show} onHide={props.onHide} className="modal-order">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Thêm nhà cung cấp
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn thực sự muốn xóa nhà cung cấp này {props.dataModal.email} ?{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Hủy
          </Button>
          <Button variant="danger" onClick={props.comfirmDeleteSupplier}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDeleteSupplier;
