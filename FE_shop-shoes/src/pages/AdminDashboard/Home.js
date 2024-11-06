import React, { useEffect, useRef, useState } from "react";
import "./Home.scss";
import { BsFillArchiveFill, BsPeopleFill } from "react-icons/bs";
import { FaMoneyBillAlt } from "react-icons/fa";
import { MdOutlineBorderColor } from "react-icons/md";
import Nav from "./Nav";
import ApexCharts from "react-apexcharts";
// import axios from "axios";
import { getAllOrder, getDataManageAdmin } from "../../service/productService";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from "react-paginate";

const Home = (props) => {
  function formatDay(item) {
    const date = new Date(item.day);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng trong JavaScript đếm từ 0
    const formattedDate = `${day}/${month}`;

    return formattedDate;
  }

  const dataChartMonthDf = {
    data: [10], // Sample prices
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };

  const [dataManage, setDataManage] = useState([]);
  const [dataChartMonth, setDataChartMonth] = useState(dataChartMonthDf);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [dataOrder, setDataOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const fectchDtManage = async () => {
    let res = await getDataManageAdmin();
    if (res && res.errCode === 0) {
      setDataManage(res.DT);
      setDataChartMonth({
        data: res.DT?.monthlyRevenue?.map((item) => item.totalMoney),
        categories: res.DT?.monthlyRevenue?.map((item) => formatDay(item)),
      });
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    fectchDtManage();
  }, []);

  console.log(dataChartMonth);
  const chartRef = useRef(null);

  const optionsbyMonth = {
    series: [
      {
        name: "Tổng tiền",
        data: dataChartMonth.data,
      },
    ],
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Thống kê theo ngày",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        },
      },

      theme: "dark",
    },
    xaxis: {
      categories: dataChartMonth.categories,
    },
  };

  const getDataOrder = async () => {
    let res = await getAllOrder(
      currentPage,
      currentLimit,
      "",
      startDate || "",
      endDate || "",
      1
    );
    if (res && res.errCode === 0) {
      setDataOrder(res?.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    getDataOrder();
  }, [dateRange]);

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
  };

  return (
    <div className="home auto">
      <Nav />

      <div className="main-card">
        <div className="card">
          <div className="card-inner">
            <h3>Tổng doanh thu</h3>
            <FaMoneyBillAlt className="card_icon" />
          </div>
          <h1>{dataManage?.totalRevenue?.toLocaleString("vi-VN")} đ</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Khách Hàng</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{dataManage?.totalCustomers}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Sản phẩm</h3>

            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{dataManage?.totalProducts}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Đang chờ duyệt</h3>
            <MdOutlineBorderColor className="card-icon" />
          </div>
          <h1>{dataManage?.totalOrdersPending}</h1>
        </div>
      </div>

      <h2 className="mt-8 font-semibold text-center text-black">
        Thống kê doanh thu theo tháng và năm
      </h2>

      <div className="grid items-center w-full grid-cols-7 gap-4 mt-4">
        <div id="chartByMonth" ref={chartRef} className="col-span-5">
          <ApexCharts
            options={optionsbyMonth}
            series={optionsbyMonth.series}
            type="line"
            height={350}
          />
        </div>
        <div className="main-card !col-span-2 !flex !flex-col !mt-0 !mb-12">
          <div className="flex-1 !flex flex-col gap-2 card">
            <div className="card-inner">
              <h3>Doanh thu tuần</h3>
              <FaMoneyBillAlt className="card_icon" />
            </div>
            <h1>{dataManage?.totalRevenueWeek?.toLocaleString("vi-VN")} đ</h1>
          </div>
          <div className="flex-1 !flex flex-col gap-2 card">
            <div className="card-inner">
              <h3>Doanh thu tháng</h3>
              <BsPeopleFill className="card_icon" />
            </div>
            <h1>{dataManage?.totalRevenueYear?.toLocaleString("vi-VN")} đ</h1>
          </div>
        </div>
      </div>

      <div className="date-picker">
        <div className="date-range">
          <h6>Chọn ngày:</h6>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            isClearable={true}
          />
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên khách hàng</th>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
              <th>Ngày Giao</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {dataOrder?.length > 0 &&
              dataOrder.map((item, index) => {
                const createdAtDate = new Date(item?.createdAt);
                const formattedDate = `${createdAtDate.getDate()}/${
                  createdAtDate.getMonth() + 1
                }/${createdAtDate.getFullYear()} ${createdAtDate.getHours()}:${
                  createdAtDate.getMinutes() < 10
                    ? "0" + createdAtDate.getMinutes()
                    : createdAtDate.getMinutes()
                }`;

                const updatedAtDate = new Date(item?.updatedAt);
                const dateUpdate = `${updatedAtDate.getDate()}/${
                  createdAtDate.getMonth() + 1
                }/${updatedAtDate.getFullYear()} ${updatedAtDate.getHours()}:${
                  updatedAtDate.getMinutes() < 10
                    ? "0" + updatedAtDate.getMinutes()
                    : updatedAtDate.getMinutes()
                }`;
                return (
                  <tr key={index}>
                    <td>#{item?.id}</td>
                    <td>{item?.username}</td>
                    <td>
                      {item?.orderDetail?.length > 0 &&
                        item?.orderDetail?.map((product, i) => (
                          <ul key={i}>
                            <li>{product?.product?.productName}</li>
                            <li>size:{product?.size}</li>
                          </ul>
                        ))}
                    </td>
                    <td>
                      {item?.orderDetail?.length > 0 &&
                        item?.orderDetail?.map((product, i) => (
                          <p key={i}>
                            {parseInt(product?.price).toLocaleString("vi-VN")}đ
                          </p>
                        ))}
                    </td>
                    <td>
                      {item?.orderDetail?.length > 0 &&
                        item?.orderDetail?.map((product, i) => (
                          <p key={i}>
                            {parseInt(product?.quantity).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                        ))}
                    </td>
                    <td>
                      {parseInt(item?.totalMoney).toLocaleString("vi-VN")}đ
                    </td>
                    <td>{formattedDate}</td>
                    <td>{dateUpdate}</td>
                    <td>Đã giao</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <ReactPaginate
          breakLabel="..."
          nextLabel=" >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={4}
          pageCount={totalPages}
          previousLabel="< "
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </div>
  );
};

export default Home;
