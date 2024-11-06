import axios from "axios";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

const DistrictDropDwon = ({ provinceCode, onChange }) => {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
        );
        setDistricts(response.data.districts);
      } catch (error) {
        console.log(error);
      }
    };

    if (provinceCode) {
      fetchDistricts();
    }
  }, [provinceCode]);

  return (
    <Form.Select id="district" onChange={onChange}>
      <option disabled value="">
        Chọn
      </option>
      {districts.map((district) => (
        <option key={district.code} value={district.code} name={district.name}>
          {district.name}
        </option>
      ))}
    </Form.Select>
  );
};

export default DistrictDropDwon;
