import React from "react";
import "./Footer.scss";
import { Link } from "react-router-dom";

function Footer(props) {
  return (
    <footer className="bg-light text-dark pt-5 pb-4">
      <div className="container md:text-center text-left">
        <div className="row md:text-center text-left">
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-info">
              SHOES
            </h5>
            <hr className="mb-4" />
            <p>chuyen ban giay</p>
          </div>

          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-info">
              Về chúng tôi
            </h5>
            <hr className="mb-4" />
            <p>
              <Link to="" className="text-dark">
                Giới thiệu
              </Link>
            </p>
            <p>
              <Link to="" className="text-dark">
                Điều khoản sử dụng
              </Link>
            </p>
            <p>
              <Link to="" className="text-dark"></Link>
            </p>
            <p>
              <Link to="" className="text-dark"></Link>
            </p>
          </div>

          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-info">
              Chính sách
            </h5>
            <hr className="mb-4" />
            <p>
              <Link to="" className="text-dark">
                Chính sách bảo hành & đổi trả
              </Link>
            </p>
            <p>
              <Link to="" className="text-dark">
                Chính sách vận chuyển
              </Link>
            </p>
            <p>
              <Link to="" className="text-dark">
                Chính sách thanh toán
              </Link>
            </p>
            <p>
              <Link to="" className="text-dark">
                Chính sách bảo mật
              </Link>
            </p>
          </div>

          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-info">
              Thông tin liên hệ
            </h5>
            <hr className="mb-4" />
            <p>
              <i className="fas fa-home mr-3"></i> 177 Cầu diễn ,Từ Liên, hà Nội
            </p>
            <p>
              <i className="fas fa-envelope mr-3"></i> admin@gmail.com
            </p>
            <p>
              <i className="fas fa-phone mr-3"></i> 0336909524
            </p>
          </div>

          <hr className="mb-4" />
          <div className="row d-flex justify-content-center">
            <div>
              <p>
                Copyright 2023 All Rights Reserved By:
                <Link to="" className="text-dark">
                  <strong className="text-info"> Shoe store</strong>
                </Link>
              </p>
            </div>
          </div>

          <div className="row d-flex justify-content-center">
            <div className="text-center">
              <ul className="list-unstyled list-inline">
                <li className="list-inline-item">
                  <Link to="" className="text-dark">
                    <i className="fab fa-facebook"></i>
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="" className="text-dark">
                    <i className="fab fa-instagram"></i>
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="" className="text-dark">
                    <i className="fab fa-google-plus"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
