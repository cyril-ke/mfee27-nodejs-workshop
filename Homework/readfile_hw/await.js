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

async function result() {
    try{
        let result1 = await doReadFile('test.txt', 'utf8');
        console.log('test.txt', result1);

        let result2 = await doReadFile('test2.txt', 'utf8');
        console.log('test2.txt', result2);
    } catch (err) {
        console.log(err);
    }
}
result();