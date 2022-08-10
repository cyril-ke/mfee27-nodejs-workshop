function doWork(job, timer) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let dt = new Date();
            resolve(`完成工作 ${job} at ${dt.toISOString()}`);
        }, timer);
    });
}

let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);
// 刷牙(3) => 吃早餐(5) => 寫功課(3)
// async 回傳的是 promise
async function test() {
    console.log('in test');
    // non-blocking
    // await 一定要寫在 async 函式裡
    // await 暫停 -> 當被 await 的那個 promise 被 resovle 的時候就會解除暫停
    // async 就是暫停的範圍
    try {
        let brushResult = await doWork('刷牙', 3000);
        console.log('await brush', brushResult);

        // 開發習慣上，不要把 await 跟 then 混在一起寫
        // 容易搞混執行順序
        // doWork('AAA', 6000).then((data) => {
        //   console.log('AAA', data);
        // });

        let eatResult = await doWork('吃早餐', 5000);
        console.log('await eat', eatResult);

        let writeResult = await doWork('寫功課', 3000);
        console.log('await write', writeResult);
    } catch (err) {
        // await/async 沒有內建的錯誤處理機制，就用 JS 原本的 try-catch 處理
        console.error(err);
    }
    return 'a';
}
let testResult = test();
testResult.then((data) => {
    // 這裡會是 async function 回傳的結果
    console.log('testResult', data);
});
console.log('finish', testResult);