// Promise 是一個表示非同步運算的「最終」完成或失敗的物件
// - 物件 new Promise();
// 建構式 Promise，需要傳一個參數 executor
// new Promise(executor);
// executor: 也是一個函式，有兩個參數 resolve, reject
// function executor(resolve, reject)
// (resolve, reject) => {}
// - 非同步: 把非同步程式搬進去 executor 裡
// - 最終完成: 呼叫 resolve -> resolve(資料)
// - 最終失敗: 呼叫 reject -> reject(失敗原因)

function doWork(job, timer) {
    return new Promise((resolve, reject) => {
        // 非同步運算
        setTimeout(() => {
            let dt = new Date();
            // 如果失敗
            // reject(失敗原因)
            // reject({ error: '故意失敗' });
            // 如果成功
            // resolve(結果)
            resolve(`完成工作 ${job} at ${dt.toISOString()}`);
        }, timer);
    });
}

let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);
// 刷牙(3) => 吃早餐(5) => 寫功課(3)

doWork('刷牙', 3000)
    .then((data) => {
        // 用來接住 resolve 後的東西
        console.log('在 promise 裡', data);
        return doWork('吃早餐', 5000);
    })
    .then((data) => {
        // promise chain
        console.log('在 promise 裡', data);
        return doWork('寫功課', 3000);
    })
    .then((data) => {
        console.log('在 promise 裡', data);
    })
    .catch((err) => {
        // 用來接住 reject
        console.error('在 promise 發生錯誤:', err);
    });