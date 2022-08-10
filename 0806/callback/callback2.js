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

let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);

// brush -> eat -> write
// write -> brush -> eat
// 耦合性

brush();

function brush() {
    doWork('刷牙', 3000, function (err, data) {
        // 處理錯誤
        if (err) {
            console.error('發生錯誤了', err);
            return;
        }
        // 正確要繼續
        console.log('執行成功:', data);
        eat();
    });
}

function eat() {
    doWork('吃早餐', 5000, function (err, data) {
        // 處理錯誤
        if (err) {
            console.error('發生錯誤了', err);
            return;
        }
        console.log('執行成功:', data);
        write();
    });
}

function write() {
    doWork('write', 3000, function (err, data) {
        if (err) {
            console.error('發生錯誤了', err);
            return;
        }
        console.log('執行成功:', data);
    });
}