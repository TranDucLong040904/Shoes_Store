import axios from "axios";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

const WardDropdown = ({ districtCode, onChange }) => {
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
        );
        setWards(response.data.wards);
      } catch (error) {
        console.log(error);
      }
    };

    if (districtCode) {
      fetchWards();
    }
  }, [districtCode]);

  return (
    <Form.Select id="ward" onChange={onChange}>
      <option disabled value="">
        Chọn
      </option>
      {wards.map((ward) => (
        <option key={ward.code} value={ward.code} name={ward.name}>
          {ward.name}
        </option>
      ))}
    </Form.Select>
  );
};

export default WardDropdown;
