import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { reviewProduct } from "../../../service/reviewService";

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

function Review({ userId, productId }) {
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0);
  const [review, setReview] = useState({
    userId: "",
    productId: "",
    content: "",
    star: 0,
  });

  const handleClick = (value) => {
    setReview({
      ...review,
      star: value,
    });
  };

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  useEffect(() => {
    setReview({
      ...review,
      userId: userId,
      productId: productId,
    });
  }, [userId, productId]);

  const handleSubmit = async () => {
    if (review?.star === 0) {
      toast.error("Vui lòng chọn số sao");
      return;
    }
    if (review?.content === "") {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    console.log(review);
    let res = await reviewProduct(review);
    if (res && res.errCode === 0) {
      toast.success("Đánh giá thành công");
    } else {
      toast.error(res.errMessage);
    }
  };
  return (
    <div style={styles.container}>
      <h2> Đánh giá của bạn </h2>
      <div style={styles.stars}>
        {stars.map((_, index) => {
          return (
            <FaStar
              key={index}
              size={24}
              onClick={() => handleClick(index + 1)}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={
                (hoverValue || review?.star) > index
                  ? colors.orange
                  : colors.grey
              }
              style={{
                marginRight: 10,
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>
      <textarea
        placeholder="Nhận xét của bạn"
        style={styles.textarea}
        onChange={(e) => {
          setReview({ ...review, content: e.target.value });
        }}
      />

      <button
        style={styles.button}
        onClick={() => {
          handleSubmit();
        }}
      >
        Gửi
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  textarea: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    padding: 10,
    margin: "20px 0",
    minHeight: 100,
    width: 300,
  },
  button: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 300,
    padding: 10,
  },
};

export default Review;
