const express = require("express");
// 初始化 dotenv
require("dotenv").config();
// 利用 express 這個框架/函式庫 來建立一個 web application
const app = express();

// 在程式碼中，不要讓某些常數散亂在專案的各處
// 至少在同一個檔案中，可以放到最上方統一管理
// 目標是: 只需要改一個地方，全部的地方就生效
// 降低漏改到的風險 -> 降低程式出錯的風險
const port = process.env.SERVER_PORT;

const cors = require("cors");
app.use(cors());

// 使用資料庫
const mysql = require("mysql2");
let pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // 限制 pool 連線數的上限
    connectionLimit: 10,
  })
  .promise();

// 設定視圖引擎，我們用的是 pug
// npm i pug
app.set("view engine", "pug");
// 告訴 express 視圖在哪裡
app.set("views", "views");

// 測試 server side render 的寫法
app.get("/ssr", (req, res, next) => {
  // views/index.pug
  res.render("index", {
    stocks: ["台積電", "長榮航", "聯發科"],
  });
});

// express 是由 middleware 組成的
// request -> middleware 1 -> middleware 2 -> ... -> reponse
// 中間件的順序很重要!!
// Express 會按照你程式碼的順序(由上到下)去決定 next 是誰
// 中間件裡一定要有 next 或者 response
// - next() 往下一關走
// - res.xxx 結束這次的旅程 (req-res cycle)
// pipeline pattern

// 一般的 middleware
app.use((req, res, next) => {
  console.log("這是中間件 A");
  let now = new Date();
  console.log(`有人來訪問喔 at ${now.toISOString()}`);
  // 一定要寫，讓 express 知道要跳去下一個中間件
  next();
});

app.use((req, res, next) => {
  console.log("這是中間件 C");
  // 一定要寫，讓 express 知道要跳去下一個中間件
  next();
});

// 路由中間件
// app.[method]
// method: get, post, delete, put, patch, ...
// GET /
app.get("/", (req, res, next) => {
  console.log("這裡是首頁");
  res.send("Hello Express");
});
app.get("/test", (req, res, next) => {
  console.log("這裡是 test 1");
  res.send("Hello Test 1");
  // next();
});

// API
// 列出所有股票代碼
// GET /stocks
app.get("/api/1.0/stocks", async (req, res, next) => {
  // 寫法1:
  // let result = await pool.execute('SELECT * FROM stocks');
  // let data = result[0];
  // 寫法2:
  let [data] = await pool.execute("SELECT * FROM stocks");

  // console.log('result', data);
  res.json(data);
});

// app.get('/test', (req, res, next) => {
//   console.log('這裡是 test 2');
//   res.send('Hello Test 2');
// });

// 在所有的路由中間件的下面
// 既然前面所有的「網址」都比不到，表示前面沒有任何符合的網址 (旅程一直沒有被結束)
// --> 404
// 利用這個特殊的順序，把這裡當成 404
app.use((req, res, next) => {
  console.log("在所有路由中間件的下面 -> 404 了！");
  res.status(404).send("Not Found!!");
});

// 啟動 server，並且開始 listen 一個 port
app.listen(port, () => {
  console.log(`server start at ${port}`);
});
