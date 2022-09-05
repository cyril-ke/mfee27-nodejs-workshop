const express = require('express');
const pool = require('../utils/db');
const router = express.Router();
const bcrypt = require('bcrypt');

// 如果要讓 express 認得 json，要使用 express 中間件，
// 順序非常重要
// 第1個放在app
// 第2個針對這個router使用某些中間件
// 第3個針對某個路由中間件用
router.use(express.json())

// /api/1.0/auth/register
router.post('/api/1.0/auth/register', async (req, res, next) => {
  // 確認資料有沒有收到
  // POST來的資料通常存在body裡
  console.log('register', req.body);
  // TODO:驗證來自前端的資料

  // 檢查email 有沒有重複
  // 方法1: 交給 DB: 把email 欄位設定成 unique
  // 方法2: 我們自己去檢查 -> 去資料庫撈撈看這個 email 有沒有存在
  let [members] = await pool.execute('SELECT * FROM members WHERE email =?', [req.body.email])
  if(members.length == 0){
  // 密碼要雜湊，hash
  let hashedPassword = await bcrypt.hash(req.body.password, 10)
  
  // 資料存到資料庫
  let result = await pool.execute('INSERT INTO members (email, password, name) VALUES (?, ?, ?)', [req.body.email, hashedPassword, req.body.name])
  console.log('insert new member', result);

  // 回覆前端
  res.json({ message: 'ok' });
  } else {
    // members 的長度 > 0 -> 有資料 -> 這個 email 註冊過
    // 如果有回覆 400 跟錯誤訊息
    return res.status(400).json({message: '這個 email 已經註冊過'})
  } 
})

module.exports = router