import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const ModalNotification = (props) => {
  const { show, handleClose } = props;

  return (
    <>
      <Modal show={show} onHide={handleClose} className="modal-order">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="row g-3 needs-validation">
            <Form.Group className="" controlId="formBasicName">
              <Form.Label>
                Tên <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group className="" controlId="formBasicEmail">
              <Form.Label>
                Email <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group className="" controlId="formBasicNumber">
              <Form.Label>
                Phone <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group className=""></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button></Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalNotification;
