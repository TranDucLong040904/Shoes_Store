import axios from "../axios";

const reviewProduct = (data) => {
  return axios.post("/api/v1/review/create", data, {
    withCredentials: true,
  });
};

const getAllReview = () => {
  return axios.get("/api/v1/review", {
    withCredentials: true,
  });
};

export { reviewProduct, getAllReview };
