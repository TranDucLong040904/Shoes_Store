function Validation(values) {
  let error = {};
  const email_pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const password_pattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (values.username === "") {
    error.username = "Họ tên không được để trống";
  } else {
    error.username = "";
  }

  if (values.email === "") {
    error.email = "Email không được để trống";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email không hợp lệ!";
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = "Mật khẩu không được để trống";
  } else if (!password_pattern.test(values.password)) {
    error.password = "Mật khẩu không khớp";
  } else {
    error.password = "";
  }

  return error;
}

export default Validation;
