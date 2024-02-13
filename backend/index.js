const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userModel");

//initialization
const app = express();
app.use(express.json());

app.use("/api", require("./controller/usercontroller"));

//connnectivity
const url = "mongodb+srv://user:user123@cluster0.b8hui6y.mongodb.net/auth";
mongoose.connect(url).then(() => console.log("db connected successful1"));

const server = app.listen(4000, () => {
  console.log("server has started");
});
