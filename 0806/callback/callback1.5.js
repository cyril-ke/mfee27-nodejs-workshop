function doWork(job, timer, cb) {
    // 為了模擬一個非同步工作
    setTimeout(() => {
        let dt = new Date();
        // callback 慣用設計：
        // 第一個參數: error
        // 第二個參數: 要回覆的資料
        cb(null, `完成工作 ${job} at ${dt.toISOString()}`);
    }, timer);
}

// 這個寫法並不是「接續」做，他會三件事同時做

let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);
// 刷牙(3) => 吃早餐(5) => 寫功課(3)
doWork('刷牙', 3000, function (err, data) {
    // 只有在這裡、當這個 callback 被呼叫的時候
    // 才可以很確定這件事做完了
    if (err) {
        console.error('發生錯誤了', err);
    } else {
        console.log('執行成功:', data);
    }
});
doWork('吃早餐', 8000, function (err, data) {
    // 只有在這裡、當這個 callback 被呼叫的時候
    // 才可以很確定這件事做完了
    if (err) {
        console.error('發生錯誤了', err);
    } else {
        console.log('執行成功:', data);
    }
});
doWork('寫功課', 11000, function (err, data) {
    // 只有在這裡、當這個 callback 被呼叫的時候
    // 才可以很確定這件事做完了
    if (err) {
        console.error('發生錯誤了', err);
    } else {
        console.log('執行成功:', data);
    }
});