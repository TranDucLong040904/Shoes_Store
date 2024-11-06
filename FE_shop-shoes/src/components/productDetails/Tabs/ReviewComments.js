import React from "react";
import "./Review.scss";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

const ReviewComments = ({ reviews }) => {
  return (
    <>
      <div className="reviews">
        <div className="review">
          {reviews?.length > 0 &&
            reviews?.map((item, index) => {
              const createdAtDate = new Date(item?.createdAt);
              const formattedDate = `${createdAtDate.getDate()}/${
                createdAtDate.getMonth() + 1
              }/${createdAtDate.getFullYear()} ${createdAtDate.getHours()}:${
                createdAtDate.getMinutes() < 10
                  ? "0" + createdAtDate.getMinutes()
                  : createdAtDate.getMinutes()
              }`;
              return (
                <div className="customer" key={index}>
                  <IoPersonCircleOutline className="icons" />
                  <div className="comment">
                    <span>{item?.user?.username || "Anonymous"}</span>
                    <div className="flex star">
                      {Array.from({ length: item?.star }, (_, starIndex) => (
                        <FaStar key={starIndex} color="#ffc107" />
                      ))}
                    </div>
                    <p className="time">{formattedDate}</p>
                    <p className="text-commnet">{item?.content}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ReviewComments;
