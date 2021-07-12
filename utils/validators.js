module.exports.validateRegisterUser = (
  username,
  password,
  confirmPassword,
  email
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email";
    }
  }
  if (password === "") {
    errors.password = "Password must be a valid password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }
  return {
    errors: errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginUser = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password === "") {
    errors.password = "Password must not be empty";
  }
  return {
    errors: errors,
    valid: Object.keys(errors).length < 1,
  };
};
