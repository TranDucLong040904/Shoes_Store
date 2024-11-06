import axios from "../axios";

const createNewUser = (username, email, password) => {
  return axios.post("/api/v1/create-new-user", {
    username,
    email,
    password,
  });
};

const loginUser = (valueLogin, password) => {
  return axios.post("/api/v1/login", {
    valueLogin,
    password,
  });
};

const getCustomer = (page, limit, sortByName) => {
  return axios.get(
    `/api/v1/getstaff?page=${page}&limit=${limit}&sortByName=${sortByName}`
  );
};
const getUser = (page, limit) => {
  return axios.get(`/api/v1/getuser?page=${page}&limit=${limit}`);
};
const getOneCustomer = (id) => {
  return axios.get(`/api/v1/getuser/${id}`);
};
const deleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
};
const createCustomer = (data) => {
  return axios.post(`/api/v1/create-new-user`, data);
};
const editCustomer = (data) => {
  return axios.put(`/api/v1/user/update`, data);
};

const fetchSizeShoes = () => {
  return axios.get("/api/v1/size");
};

const createNewSuppiler = (selectedData) => {
  return axios.post("/api/v1/supplier/create", { ...selectedData });
};

const fetchAllSupplier = (page, limit, sortByName) => {
  return axios.get(
    `/api/v1/supplier/read?page=${page}&limit=${limit}&sortByName=${sortByName}`
  );
};
const fetchAllSupplierNoLimit = (page, limit) => {
  return axios.get(`/api/v1/supplier/read`);
};

const deleteSupplier = (supplier) => {
  return axios.delete("/api/v1/supplier/delete", { data: { id: supplier.id } });
};

const updateSupplier = (supplier) => {
  return axios.put("/api/v1/supplier/update", { ...supplier });
};

export {
  createNewUser,
  loginUser,
  fetchSizeShoes,
  createNewSuppiler,
  fetchAllSupplier,
  deleteSupplier,
  updateSupplier,
  getCustomer,
  getOneCustomer,
  createCustomer,
  editCustomer,
  deleteUser,
  getUser,
  fetchAllSupplierNoLimit,
};
