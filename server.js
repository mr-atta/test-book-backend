"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();
//
const app = express();
app.use(cors());
app.use(express.json());
//
const PORT = 3005;
//
const myUserModel = require("./modules/schema");
//mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//

// add data maneul by seed function
function seedBookData() {
  const mohammad = new myUserModel({
    email: "mohammadatta97@gmail.com",
    books: [
      {
        name: "The Big Short",
        description:
          "A description of the events leading up to the 2007-2008 world financial crisis by financial journalist Michael Lewis, this bestselling non-fiction book spent 28 weeks on the New York Times bestseller list.",
        states: "Michael Lewis ",
        img: "https://upload.wikimedia.org/wikipedia/en/2/2f/Big-short-inside-the-doomsday-machine.jpg",
      },
      {
        name: "Boom and Bust: A Global History of Financial Bubbles",
        description:
          "Why do stock and housing markets sometimes experience amazing booms followed by massive busts and why is this happening more and more frequently?",
        states: " David John Turner and William Quinn ",
        img: "http://assets.cambridge.org/97811084/21256/cover/9781108421256.jpg",
      },
    ],
  });
  const razan = new myUserModel({
    email: "razan@gmail.com",
    books: [
      {
        name: "The Big Short",
        description:
          "A description of the events leading up to the 2007-2008 world financial crisis by financial journalist Michael Lewis, this bestselling non-fiction book spent 28 weeks on the New York Times bestseller list.",
        states: "Michael Lewis ",
        img: "https://upload.wikimedia.org/wikipedia/en/2/2f/Big-short-inside-the-doomsday-machine.jpg",
      },
      {
        name: "Boom and Bust: A Global History of Financial Bubbles",
        description:
          "Why do stock and housing markets sometimes experience amazing booms followed by massive busts and why is this happening more and more frequently?",
        states: " David John Turner and William Quinn ",
        img: "http://assets.cambridge.org/97811084/21256/cover/9781108421256.jpg",
      },
    ],
  });
  mohammad.save();
  razan.save();
}
// seedBookData();

//
// http://localhost:3005/
app.get("/", testHandler);

// http://localhost:3005/getbooks?email=mohammadatta97@gmail.com
app.get("/getbooks", getBooksHandler);

// http://localhost:3005/addbooks?email=mohammadatta97@gmail.com
app.post("/addbooks", addBooksHandler);

// http://localhost:3005/deletebooks/${i}
app.delete("/deletebooks/:id", deletebooksHandler);

// http://localhost:3005/updatebooks/${i}
app.put("/updatebooks/:id", updateBooksHandler);

function updateBooksHandler(req, res) {
  const { email, name, description, img } = req.body;
  const index = Number(req.params.id);

  myUserModel.findOne({ email: email }, (error, upData) => {
    if (error) {
      res.send("error");
    } else {
      upData.books.splice(index, 1, {
        name: name,
        description: description,
        img: img,
      });
    }
    console.log(upData.books);
    upData.save();
    res.send(upData.books);
  });
}

function deletebooksHandler(req, res) {
  let email = req.query.email;
  let index = Number(req.params.id);

  myUserModel.findOne({ email: email }, (error, delData) => {
    // console.log(delData.books);
    if (error) {
      res.send("error");
    } else {
      const dataAfterFilter = delData.books.filter((ele, i) => {
        if (i != index) {
          return ele;
        }
      });
      delData.books = dataAfterFilter;
      console.log(delData.books);
      delData.save();
      res.send(delData.books);
    }
  });

  console.log(email, index);
}

function addBooksHandler(req, res) {
  const { email, name, description, img } = req.body;
  //   console.log(req.body.email);
  myUserModel.find({ email: email }, (error, newBookData) => {
    if (error) {
      res.send("error");
    } else {
      newBookData[0].books.push({
        name: name,
        description: description,
        img: img,
      });
      //   console.log(newBookData[0].books);
      newBookData[0].save();
      res.send(newBookData[0].books);
    }
  });
}

function testHandler(req, res) {
  res.send("its working");
}

function getBooksHandler(req, res) {
  let email = req.query.email;

  myUserModel.find({ email: email }, (error, booksData) => {
    // console.log("hello");
    if (error) {
      res.send("error ");
    } else {
      res.send(booksData[0].books);
    }
    // console.log(booksData[0].books);
  });
}

app.listen(PORT, () => console.log(`listen on ${PORT}`));
