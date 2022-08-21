const express = require("express");
// 初始化 dotenv
require("dotenv").config();
// 利用 express 這個框架/函式庫 來建立一個 web application
const app = express();
const port = process.env.SERVER_PORT;

// app.[method]
// method: get, post, delete, put, patch, ...
app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(port, () => {
  console.log(`server start at ${port}`);
});
