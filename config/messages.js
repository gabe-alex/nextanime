
module.exports = {
  validation: {
    username : {
      required: "Username is required.",
      unique: "Username is already taken.",
      exists: "User not found."
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
