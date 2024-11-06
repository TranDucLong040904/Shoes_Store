import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import DistrictDropDwon from "./Provinces/District";
import ProvinceDropdown from "./Provinces/Provinces";
import { useEffect, useState } from "react";
import WardDropdown from "./Provinces/Ward";
import _ from "lodash";
import { createNewSuppiler, updateSupplier } from "../../service/userService";
import { toast } from "react-toastify";

const ModalSupplier = (props) => {
  const { show, action, dataModal, onHide } = props;
  const defaultData = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const validInputsDefault = {
    name: true,
    email: true,
    phone: true,
    address: true,
  };

  const [selectedData, setSelectedData] = useState(defaultData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);
  // const [selectedProvince, setSelectedProvince] = useState("");
  // const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    if (action === "UPDATE") {
      setSelectedData(dataModal);
    }
  }, [dataModal]);

  const handleOnchangeData = (value, name) => {
    let _supplierData = _.cloneDeep(selectedData);
    _supplierData[name] = value;
    setSelectedData(_supplierData);
  };

  // const handleProvinceChange = (event) => {
  //   const selectedProvince = event.target.value;
  //   setSelectedProvince(selectedProvince);
  //   console.log("Selected provinces:", selectedProvince);
  // };

  // const handleDistrictChange = (event) => {
  //   const selectedDistrict = event.target.value;
  //   setSelectedDistrict(selectedDistrict);
  //   console.log("Selected district:", selectedDistrict);
  // };

  const checkValidate = () => {
    setValidInputs(validInputsDefault);

    let arr = ["name", "email", "phone", "address"];
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!selectedData[arr[i]]) {
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[arr[i]] = false;
        setValidInputs(_validInputs);
        toast.error(`Đầu vào ${arr[i]} trống!`);
        check = false;
        break;
      }
    }

    return check;
  };

  const handleAddSupplier = async () => {
    let check = checkValidate();
    if (check === true) {
      let res =
        action === "CREATE"
          ? await createNewSuppiler(selectedData)
          : await updateSupplier(selectedData);

      console.log("check data: ", res);
      if (res && res.errCode === 0) {
        props.onHide();
        setSelectedData({ ...defaultData });
        toast.success(res.errMessage);
      }

      if (res && res.errCode !== 0) {
        toast.error(res.errMessage);
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[res.DT] = false;
        setValidInputs(_validInputs);
      }
      // console.log("check data: ", res);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} className="modal-order">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span>
              {action === "CREATE"
                ? "Thêm nhà cung cấp"
                : "Chỉnh sửa nhà cung cấp"}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="row g-3 needs-validation">
            <Form.Group className="" controlId="formBasicName">
              <Form.Label>
                Tên <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={selectedData.name}
                className={
                  validInputs.name ? "form-control" : "is-invalid form-control"
                }
                onChange={(event) =>
                  handleOnchangeData(event.target.value, "name")
                }
              />
            </Form.Group>

            <Form.Group className="" controlId="formBasicEmail">
              <Form.Label>
                Email <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                className={
                  validInputs.email ? "form-control" : "form-control is-invalid"
                }
                type="text"
                value={selectedData.email}
                onChange={(event) =>
                  handleOnchangeData(event.target.value, "email")
                }
                disabled={action === "CREATE" ? false : true}
              />
            </Form.Group>

            <Form.Group className="" controlId="formBasicNumber">
              <Form.Label>
                Phone <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                className={
                  validInputs.phone ? "form-control" : "form-control is-invalid"
                }
                value={selectedData.phone}
                onChange={(event) =>
                  handleOnchangeData(event.target.value, "phone")
                }
              />
            </Form.Group>

            <Form.Group className="">
              <Form.Label>
                Địa chỉ <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                className={
                  validInputs.address
                    ? "form-control"
                    : "form-control is-invalid"
                }
                value={selectedData.address}
                onChange={(event) =>
                  handleOnchangeData(event.target.value, "address")
                }
              />
            </Form.Group>
            {/* <Form.Group className=" col-md-6">
              <Form.Label>Tỉnh/Thành phố</Form.Label>
              <ProvinceDropdown onChange={handleProvinceChange} />
            </Form.Group>
            <Form.Group className=" col-md-6">
              <Form.Label>Quận/Huyện</Form.Label>
              <DistrictDropDwon
                provinceCode={selectedProvince}
                onChange={handleDistrictChange}
              />
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Xã/Phường</Form.Label>
              <WardDropdown districtCode={selectedDistrict} />
            </Form.Group> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Hủy
          </Button>
          <Button onClick={handleAddSupplier}>
            {action === "CREATE" ? "Lưu" : "Cập nhật"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalSupplier;
