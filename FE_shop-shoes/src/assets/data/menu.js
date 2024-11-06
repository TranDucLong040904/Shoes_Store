import { FaHome, FaUser, FaBell } from "react-icons/fa";
import { BiCog } from "react-icons/bi";
// import {
//   AiFillFolderAdd,
//   AiFillHeart,
//   AiOutlineMenu,
//   AiTwotoneFileExclamation,
// } from "react-icons/ai";
import { BsCartCheck, BsFillArchiveFill } from "react-icons/bs";
import { AiFillFolderAdd } from "react-icons/ai";

export const routes = [
  {
    path: "/admin/manage-product",
    name: "Danh sách sản phẩm",
    icon: <BsFillArchiveFill />,
  },
  {
    path: "/admin/create-product",
    name: "Thêm sản phẩm",
    icon: <AiFillFolderAdd />,
  },
  {
    path: "/admin/supplier",
    name: "Nhà cung cấp",
    icon: <BsCartCheck />,
  },
];
