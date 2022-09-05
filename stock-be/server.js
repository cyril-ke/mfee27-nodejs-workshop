const express = require("express");
// 初始化 dotenv
// require('dotenv').config();
// 利用 express 這個框架/函式庫 來建立一個 web application
const app = express();

// 在程式碼中，不要讓某些常數散亂在專案的各處
// 至少在同一個檔案中，可以放到最上方統一管理
// 目標是: 只需要改一個地方，全部的地方就生效
// 降低漏改到的風險 -> 降低程式出錯的風險
const port = process.env.SERVER_PORT || 3002;
console.log(process);
// npm i cors
const cors = require("cors");
// 使用這個第三方提供的 cors 中間件
// 來允許跨源存取
// 預設都是全部開放
app.use(cors());
// 使用情境: 當前後端網址不同時，只想允許自己的前端來跨源存取
//          就可以利用 origin 這個設定來限制，不然預設是 * (全部)
// const corsOptions = {
//   origin: ['http://localhost:3000'],
// };
// app.use(cors(corsOptions));

// 引用 server 需要的資料庫模組
const pool = require("./utils/db");

// 如果要讓 express 認得 json，要使用 express 中間鍵，
// 順序非常重要
app.use(express.json())

// express.json  不會幫你解析 multipart/form-data，目前也沒套件解析
// Content-type: multipart/form-data

// 設定視圖引擎，我們用的是 pug
// npm i pug
app.set("view engine", "pug");
// 告訴 express 視圖在哪裡
app.set("views", "views");

//設置靜態檔案
// express.static => 讓靜態檔案可以有網址
// localhost:3002/uploads/圖片名稱....
const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));



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

// 雖然做了mini app ，但還沒跟app說要用它，所以要把他們掛勾起來
let stockRouter = require("./routers/stocks");
// router重複的網址部分，可以剪下貼過來，就可以省略router內的網址
app.use("/api/1.0/stocks", stockRouter);

let authRouter = require("./routers/auth");
app.use(authRouter);

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
