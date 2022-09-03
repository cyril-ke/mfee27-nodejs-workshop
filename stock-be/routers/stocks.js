// stock-be/routers/stocks.js
// router: mini app
const express = require("express");
const router = express.Router();

const pool = require('../utils/db')

// API
// 列出所有股票代碼
// GET /stocks
router.get("/", async (req, res, next) => {
  console.log("/api/1.0/stocks");

  // 寫法1:
  // let result = await pool.execute('SELECT * FROM stocks');
  // let data = result[0];
  // 寫法2:
  let [data] = await pool.execute("SELECT * FROM stocks");

  // console.log('result', data);
  res.json(data);
});

// 列出某個股票代碼的所有報價資料
// GET /stocks/2330?page=1
router.get("/:stockId", async (req, res, next) => {
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
  let [total] = await pool.execute(
    "SELECT COUNT(*) AS total FROM stock_prices WHERE stock_id=?",
    [stockId]
  );
  // 因為拿到的total資料格式為 [ { total: 57 } ]，所以必須再寫 total[0].total 取得我們真正要的資料
  total = total[0].total;
  // 計算總頁數 Math.ceil
  let lastPage = Math.ceil(total / perPage);

  // 計算 offset
  const offset = perPage * (page - 1);

  // 根據 perPage 及 offset 去取得資料
  // LIMIT, OFFSET 因為不是使用者自行輸入，所以風險沒有這麼高，也可以直接寫死字串
  let [data] = await pool.execute(
    "SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?",
    [stockId, perPage, offset]
  );

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

module.exports = router;
