const express = require('express');
const pool = require('../utils/db');
const router = express.Router();

// npm i bcrypt
const bcrypt = require('bcrypt');
// npm i express-validator
const { body, validationResult} = require('express-validator')

const registerRules = [
  // 中間件: 檢查 email 是否合法
  body('email').isEmail().withMessage('Email 欄位請填寫正確格式'),
  // 中間件: 檢查密碼長度
  body('password').isLength({ min:8 }).withMessage('密碼長度至少為 8'),
  // 中間件: 檢查 password & confirmPassword 是否一致
  body('confirmPassword').custom((value, { req }) => {
    return value === req.body.password;
  }).withMessage('密碼驗證不一致'),
];

const path = require('path')
// 如果是用 FormData 上傳圖片，Content-Type會是:
// Content-type: multipart/form-data
// 就要用 multer 相關的套件來處理
// npm i multer
const multer = require('multer');
// 圖片要存在哪裡?一般來說存在硬碟
// 先手動建立資料夾，設定儲存的目的地 /public/uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    // path 會幫我們處理不同作業系統間的 / 或 \
    // __dirname 目前檔案的位置， 
    
    cb(null, path.join(__dirname, '..', 'public', 'uploads'))
  },
  // 圖片名稱
  filename: function (req, file, cb){
    console.log(file);
    // 原始檔名: file.originalname => test.abc.png
    const ext = file.originalname.split('.').pop();
    // or uuid
    // https://www.npmjs.com/package/uuid
    cb(null, `member-${Date.now()}.${ext}`);
  },
});

const uploader = multer({
  storage: storage,
  // 過濾圖片的種類
  fileFilter: function (req, file, cb){
    if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png'){
      cb(new Error('上傳的檔案型態不接受'), false);
    }else{
      cb(null, true);
    }
  },
  //過濾檔案大小
  limits: {
    // 1k = 1024 => 200k = 200 * 1024
    fileSize: 200 * 1024,
  },
});

// 如果要讓 express 認得 json，要使用 express 中間件，
// 順序非常重要
// 第1個放在app
// 第2個針對這個router使用某些中間件
// 第3個針對某個路由中間件用
// router.use(express.json())

// /api/1.0/auth/register
router.post('/api/1.0/auth/register', uploader.single('photo'), registerRules, async (req, res, next) => {
  // TODO: 要用try-catch 把 await 程式包起來
  // 確認資料有沒有收到
  // POST來的資料通常存在body裡
  console.log('register', req.body, req.file);
  // 驗證來自前端的資料
1
  const validateResult = validationResult(req);
  console.log('validationResult', validateResult)
  if(!validateResult.isEmpty()){
    // validateResult 不是空 -> 有錯誤 -> 回覆給前端
    return res.status(400).json({ errors: validateResult.array() })
  }

  // 檢查email 有沒有重複
  // 方法1: 交給 DB: 把email 欄位設定成 unique
  // 方法2: 我們自己去檢查 -> 去資料庫撈撈看這個 email 有沒有存在
  let [members] = await pool.execute('SELECT * FROM members WHERE email =?', [req.body.email])
  if(members.length > 0){
    // members 的長度 > 0 -> 有資料 -> 這個 email 註冊過
    // 如果有回覆 400 跟錯誤訊息
    return res.status(400).json({message: '這個 email 已經註冊過'})
  }

  // 密碼要雜湊，hash
  let hashedPassword = await bcrypt.hash(req.body.password, 10)
  
  // 資料存到資料庫
  let filename = req.file ? '/uploads/' + req.file.filename : '';
  let result = await pool.execute('INSERT INTO members (email, password, name, photo) VALUES (?, ?, ?, ?)', [req.body.email, hashedPassword, req.body.name, filename])
  console.log('insert new member', result);

  // 回覆前端
  res.json({ message: 'ok' });
})

module.exports = router