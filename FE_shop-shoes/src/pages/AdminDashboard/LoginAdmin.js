import React, { useState } from "react";
import "./LoginAdmin.scss";

const LoginAdmin = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleLoginAdmin = () => {};
  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-content row">
          <div className="col-12 text-login">Đăng nhập</div>
          <div className="col-12 form-group login-input">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập email"
            />
          </div>
          <div className="col-12 form-group login-input">
            <label>Mật khẩu</label>
            <div className="custom-input-password">
              <input
                type={isShowPassword ? "text" : "password"}
                className="form-control"
                placeholder="Nhập mật khẩu"
              />
              <span>
                <i
                  className={
                    isShowPassword === true ? "far fa-eye" : "far fa-eye-slash"
                  }
                  onClick={() => setIsShowPassword(!isShowPassword)}
                ></i>
              </span>
            </div>
          </div>
          <div className="col-12" style={{ color: "red" }}></div>
          <div className="col-12">
            <button className="btn-login" onClick={() => handleLoginAdmin()}>
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
