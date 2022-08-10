const fs = require('fs');
// 記得要放編碼 utf8
// callback
// readFile 去硬碟讀檔案，這是很慢的事，他是非同步
function doReadFile(file, encoding) {
    return new Promise((resolve, rejects) => {
        fs.readFile(file, encoding, (err, data) => {
            if (err) {
                return rejects(err);
            } else {
                resolve(data);
            }
        })
    })
}

doReadFile('text.txt', 'utf8')
    .then((data) => {
        console.log(data); // 你在看我嗎？
    }).catch((err) => {
        console.log('發生錯誤', err);
    });