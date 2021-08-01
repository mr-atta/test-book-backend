"use strict";

const mongoose = require("mongoose");

let bookData = new mongoose.Schema({
  name: String,
  description: String,
  img: String,
});
let userData = new mongoose.Schema({
  email: String,
  books: [bookData],
});

let myUserModel = mongoose.model("user", userData);

module.exports = myUserModel;
