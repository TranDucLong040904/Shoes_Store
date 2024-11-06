import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/manage-product");
  }, []);

  return <></>;
}

export default HomePage;
