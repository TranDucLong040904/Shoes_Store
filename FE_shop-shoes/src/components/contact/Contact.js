import React from "react";
import Navbar from "../navbar/Navbar";
import "./Contact.scss";
import Footer from "../footer/Footer";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="contact">
        <h3>Liên hệ với chung tôi</h3>
        <div className="content-contact">
          <div className="left-contact">
            <form className="row g-3 needs-validation">
              <div className="col-md-12">
                <label className="form-label">Nội dung</label>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  className="p-2 border w-100"
                ></textarea>
              </div>

              <div className="col-md-12">
                <label className="form-label">Tên</label>
                <input type="text" className="form-input" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="text" className="form-input" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Điện thoại</label>
                <input type="text" className="form-input" />
              </div>
            </form>

            <button className="btn btn-primary">Gửi</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
