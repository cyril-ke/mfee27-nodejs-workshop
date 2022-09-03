const express = require('express');
// 初始化 dotenv
require('dotenv').config();
// 利用 express 這個框架/函式庫 來建立一個 web application
const app = express();

// 在程式碼中，不要讓某些常數散亂在專案的各處
// 至少在同一個檔案中，可以放到最上方統一管理
// 目標是: 只需要改一個地方，全部的地方就生效
// 降低漏改到的風險 -> 降低程式出錯的風險
const port = process.env.SERVER_PORT || 3002;
console.log(process);
// npm i cors
const cors = require('cors');
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

// 使用資料庫
const mysql = require('mysql2');
const { application } = require('express');
let pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // 限制 pool 連線數的上限
    connectionLimit: 10,
    // 請保持 date 是 string，不要轉成 js 的 date 物件
    dateStrings: true,
  })
  .promise();

// 設定視圖引擎，我們用的是 pug
// npm i pug
app.set('view engine', 'pug');
// 告訴 express 視圖在哪裡
app.set('views', 'views');

// 測試 server side render 的寫法
app.get('/ssr', (req, res, next) => {
  // views/index.pug
  res.render('index', {
    stocks: ['台積電', '長榮航', '聯發科'],
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
  console.log('這是中間件 A');
  let now = new Date();
  console.log(`有人來訪問喔 at ${now.toISOString()}`);
  // 一定要寫，讓 express 知道要跳去下一個中間件
  next();
});

app.use((req, res, next) => {
  console.log('這是中間件 C');
  // 一定要寫，讓 express 知道要跳去下一個中間件
  next();
});

// 路由中間件
// app.[method]
// method: get, post, delete, put, patch, ...
// GET /
app.get('/', (req, res, next) => {
  console.log('這裡是首頁');
  res.send('Hello Express');
});
app.get('/test', (req, res, next) => {
  console.log('這裡是 test 1');
  res.send('Hello Test 1');
  // next();
});

// API
// 列出所有股票代碼
// GET /stocks
app.get('/api/1.0/stocks', async (req, res, next) => {
  console.log('/api/1.0/stocks');

  // 寫法1:
  // let result = await pool.execute('SELECT * FROM stocks');
  // let data = result[0];
  // 寫法2:
  let [data] = await pool.execute('SELECT * FROM stocks');

  // console.log('result', data);
  res.json(data);
});

// 列出某個股票代碼的所有報價資料
// GET /stocks/2330?page=1
app.get('/api/1.0/stocks/:stockId', async (req, res, next) => {
  const stockId = req.params.stockId;

  // 去資料庫撈資料
  // let [data] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id=?', [stockId]);
  // sql injection
  // stockId 2330 || 1=1 --
  // SELECT * FROM stock_prices WHERE stock_id=2330 || 1=1 -- and ....
  // http://localhost:3002/api/1.0/stocks/2412 || 1=1 --
  // let [data] = await pool.execute(`SELECT * FROM stock_prices WHERE stock_id=${stockId}`);

  // 分頁
  // 透過 query string 取得目前要第幾頁的資料
  // 如果沒有設定，就預設要第一頁的資料
  let page = req.query.page || 1;
  // 每一頁拿五筆資料
  const perPage = 5;
  // 取得總筆數
  let [total] = await pool.execute('SELECT COUNT(*) AS total FROM stock_prices WHERE stock_id=?', [stockId]);
  // 因為拿到的total資料格式為 [ { total: 57 } ]，所以必須再寫 total[0].total 取得我們真正要的資料
  total = total[0].total;
  // 計算總頁數 Math.ceil
  let lastPage = Math.ceil(total / perPage);

  // 計算 offset
  const offset = perPage * (page - 1);

  // 根據 perPage 及 offset 去取得資料
  // LIMIT, OFFSET 因為不是使用者自行輸入，所以風險沒有這麼高，也可以直接寫死字串
  let [data] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?', [stockId, perPage, offset]);

  // 把取得的資料回覆給前端
  // 新增一些分頁的 pagination，可以查看接受到的分頁資料為何
  res.json({
    pagination: {
      total, // 總共有幾筆
      perPage, // 一頁有幾筆
      page, // 目前在第幾頁
      lastPage, // 總頁數
    },
    data,
  });
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
  console.log('在所有路由中間件的下面 -> 404 了！');
  res.status(404).send('Not Found!!');
});

// 啟動 server，並且開始 listen 一個 port
app.listen(port, () => {
  console.log(`server start at ${port}`);
});