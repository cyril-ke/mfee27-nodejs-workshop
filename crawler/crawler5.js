// 用 axios 去目標 API 抓資料
// await 版本
// 更好的參數設定
// 1. 自動取得今日日期 （可能利用 cron 排程工具 系統每日自動執行）
// 2. 從檔案中讀取股票代碼
// 查到股票代碼的中文名稱
const axios = require('axios');
const moment = require('moment');
const fs = require('fs/promises');
const mysql = require('mysql2');



// 開始抓資料
// 2330 台積電
// 2603 長榮
// axios.get(url, 設定)
(async () => {
    let connection;
    try {
        connection = mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'admin',
            password: '',
            database: 'stock_mfee27'
        })
        // 需要從 stock.txt 的檔案裡讀取股票代碼
        let stockNo = await fs.readFile('stock.txt', 'utf-8'); // 2603

        // 去查詢股票代碼的中文名稱
        // https://www.twse.com.tw/zh/api/codeQuery?query=2330
        let queryNameResponse = await axios.get('https://www.twse.com.tw/zh/api/codeQuery', {
            params: {
                query: stockNo,
            },
        });
        // console.log(queryNameResponse.data);
        let suggestions = queryNameResponse.data.suggestions;
        let suggestion = suggestions[0];
        if (suggestion === '(無符合之代碼或名稱)') {
            console.error(suggestion);
            throw new Error(suggestion);
        }
        let stockName = suggestion.split('\t').pop();
        console.log('stockName', stockName);
        let saveNameResult = connection.execute(`INSERT IGNORE INTO stocks (id, name) VALUES (?, ?)`, [stockNo, stockName]);
        console.log(saveNameResult);

        let queryDate = moment().format('YYYYMMDD'); //'20220814';
        let response = await axios.get(`https://www.twse.com.tw/exchangeReport/STOCK_DAY`, {
            params: {
                response: 'json',
                date: queryDate,
                stockNo: stockNo,
            },
        });
        console.log(response.data);
    } catch (e) {
        console.error(e);
    } finally {
        if (connection) {
            // 關掉連線
            connection.end();
        }
    }
})();