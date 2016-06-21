
module.exports = {
  validation: {
    email : {
      required: "Email is required.",
      email: "Email is not valid.",
      unique: "Email is already in use.",
      exists: "Email not found."
    },
    password: {
      required: "Password is required.",
      min: "Password must have at least 6 characters.",
      matches: "Incorrect password."
    },
    password_confirm : {
      required: "Password Confirm is required.",
      same: "Passwords don't match."
    }
  }
};
