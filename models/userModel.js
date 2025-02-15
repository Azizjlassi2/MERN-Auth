const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method

userSchema.statics.signup = async function (email, name, password) {
  //validation
  if (!email || !password || !name) {
    throw Error("All fields must be filled !");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valide");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enougn !");
  }

  // Hash password
  const salt = await bycrypt.genSalt(10);
  const hash = await bycrypt.hash(password, salt);

  const user = await this.create({ email, name, password: hash });
  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  //validation
  if (!email || !password) {
    throw Error("All fields must be filled !");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email");
  }
  const match = await bycrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
