const validatePassword = (password) => {
  return password.length >= 8;
};

const validateEmail = (email) => {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/.test(
    email
  );
};

export { validatePassword, validateEmail };
