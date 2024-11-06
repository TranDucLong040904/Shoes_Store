import axios from "axios";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

const ProvinceDropdown = ({ onChange }) => {
  const [provinces, setProvince] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setProvince(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProvinces();
  }, []);

  return (
    <Form.Select id="province" onChange={onChange}>
      <option disabled value="">
        Chọn
      </option>
      {provinces.map((province) => (
        <option key={province.code} value={province.code} name={province.name}>
          {province.name}
        </option>
      ))}
    </Form.Select>
  );
};

export default ProvinceDropdown;
