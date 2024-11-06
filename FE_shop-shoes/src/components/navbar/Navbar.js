import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllProductsInCart } from "../../utils/utils";

function Navbar(props) {
  const [user, setUser] = useState({});
  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong Local Storage không
    const storedUser = localStorage.getItem("user");

    // Nếu có, chuyển đổi chuỗi JSON thành đối tượng và cập nhật state
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [openProfile, setOpenProfile] = useState(false);
  const cartProducts = useSelector((state) => state.cart.cartProducts.data);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllProductsInCart(user?.id, dispatch, toast);
  }, [user?.id]);
  const handleOnChangeMenu = () => {
    setOpenProfile(true);
  };

  return (
    <header className="z-40">
      <div className="logo">
        <h1>
          <Link to="/" style={{ color: "#c72092", textDecoration: "none" }}>
            Shoe<span>s</span>
          </Link>
        </h1>
      </div>

      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Giới thiệu</Link>
          </li>
          <li>
            <Link to="/product-page">Thương hiệu</Link>
            {/* <ul>
              <li>
                <Link to="/admin">Jordan</Link>
              </li>
              <li>
                <Link to="/product-page">Adidas</Link>
              </li>
              <li>
                <Link to="/order">Nike</Link>
              </li>
            </ul> */}
          </li>
          <li>
            <Link to="/sale-product">Sale</Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Link to="/cart">
            <svg
              width="28"
              height="28"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.1667 14C13.2417 14 12.5 14.7417 12.5 15.6667C12.5 16.1087 12.6756 16.5326 12.9882 16.8452C13.3008 17.1577 13.7247 17.3333 14.1667 17.3333C14.6087 17.3333 15.0327 17.1577 15.3452 16.8452C15.6578 16.5326 15.8334 16.1087 15.8334 15.6667C15.8334 15.2246 15.6578 14.8007 15.3452 14.4881C15.0327 14.1756 14.6087 14 14.1667 14ZM0.833374 0.666656V2.33332H2.50004L5.50004 8.65832L4.36671 10.7C4.24171 10.9333 4.16671 11.2083 4.16671 11.5C4.16671 11.942 4.3423 12.3659 4.65486 12.6785C4.96742 12.9911 5.39135 13.1667 5.83337 13.1667H15.8334V11.5H6.18337C6.12812 11.5 6.07513 11.478 6.03606 11.439C5.99699 11.3999 5.97504 11.3469 5.97504 11.2917C5.97504 11.25 5.98337 11.2167 6.00004 11.1917L6.75004 9.83332H12.9584C13.5834 9.83332 14.1334 9.48332 14.4167 8.97499L17.4 3.58332C17.4584 3.44999 17.5 3.30832 17.5 3.16666C17.5 2.94564 17.4122 2.73368 17.256 2.5774C17.0997 2.42112 16.8877 2.33332 16.6667 2.33332H4.34171L3.55837 0.666656M5.83337 14C4.90837 14 4.16671 14.7417 4.16671 15.6667C4.16671 16.1087 4.3423 16.5326 4.65486 16.8452C4.96742 17.1577 5.39135 17.3333 5.83337 17.3333C6.2754 17.3333 6.69932 17.1577 7.01188 16.8452C7.32445 16.5326 7.50004 16.1087 7.50004 15.6667C7.50004 15.2246 7.32445 14.8007 7.01188 14.4881C6.69932 14.1756 6.2754 14 5.83337 14Z"
                fill="black"
              />
            </svg>
          </Link>
          <p className="absolute top-0 right-0 translate-x-[50%] translate-y-[-50%] px-1 font-semibold text-[14px] bg-white border rounded-full">
            {cartProducts?.length || 0}
          </p>
        </div>
        {user?.email ? (
          <div className="relative flex items-center justify-center ">
            <span onClick={() => setOpenProfile((prev) => !prev)}>
              <svg
                width="34"
                height="34"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.0001 1.66663C5.39758 1.66663 1.66675 5.39746 1.66675 9.99996C1.66675 14.6025 5.39758 18.3333 10.0001 18.3333C14.6026 18.3333 18.3334 14.6025 18.3334 9.99996C18.3334 5.39746 14.6026 1.66663 10.0001 1.66663ZM7.08341 7.91663C7.08341 7.5336 7.15886 7.15433 7.30543 6.80047C7.45201 6.4466 7.66685 6.12507 7.93769 5.85423C8.20852 5.58339 8.53006 5.36855 8.88392 5.22198C9.23779 5.0754 9.61706 4.99996 10.0001 4.99996C10.3831 4.99996 10.7624 5.0754 11.1162 5.22198C11.4701 5.36855 11.7916 5.58339 12.0625 5.85423C12.3333 6.12507 12.5482 6.4466 12.6947 6.80047C12.8413 7.15433 12.9167 7.5336 12.9167 7.91663C12.9167 8.69017 12.6095 9.43204 12.0625 9.97902C11.5155 10.526 10.7736 10.8333 10.0001 10.8333C9.22653 10.8333 8.48467 10.526 7.93769 9.97902C7.39071 9.43204 7.08341 8.69017 7.08341 7.91663ZM15.2151 14.1533C14.5913 14.938 13.7982 15.5716 12.8952 16.0068C11.9922 16.442 11.0025 16.6676 10.0001 16.6666C8.99765 16.6676 8.00797 16.442 7.10494 16.0068C6.20191 15.5716 5.40888 14.938 4.78508 14.1533C6.13591 13.1841 7.97925 12.5 10.0001 12.5C12.0209 12.5 13.8642 13.1841 15.2151 14.1533Z"
                  fill="black"
                />
              </svg>
            </span>
          </div>
        ) : (
          <NavLink to={"/login"}>
            <button className="px-3 py-2 text-white bg-[#44bece] rounded-md">
              Đăng nhập
            </button>
          </NavLink>
        )}
      </div>

      {/* <DropMenu /> */}
    </header>
  );
}

export default Navbar;
