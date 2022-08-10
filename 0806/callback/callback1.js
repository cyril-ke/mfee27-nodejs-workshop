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
// 刷牙(3) => 吃早餐(5) => 寫功課(3)
// 開始工作 at 2022-08-06T02:46:54.746Z
// 執行成功: 完成工作 刷牙 at 2022-08-06T02:46:57.761Z
// 執行成功: 完成工作 吃早餐 at 2022-08-06T02:47:02.761Z
// 執行成功: 完成工作 寫功課 at 2022-08-06T02:47:05.761Z
doWork('刷牙', 3000, function (err, data) {
  // 只有在這裡、當這個 callback 被呼叫的時候
  // 才可以很確定這件事做完了
  // 處理錯誤
  if (err) {
    console.error('發生錯誤了', err);
    return;
  }
  // 正確就繼續
  console.log('執行成功:', data);
  doWork('吃早餐', 5000, function (err, data) {
    if (err) {
      console.error('發生錯誤了', err);
      return;
    }
    console.log('執行成功:', data);
    doWork('寫功課', 3000, function (err, data) {
      if (err) {
        console.error('發生錯誤了', err);
        return;
      }
      console.log('執行成功:', data);
    });
  });
});
console.log('已經刷完牙？'); // 還不知道

// doWork('刷牙', 3000, function (err, data) {

//   兩種 if-else 寫法都一樣的效果，
//   我們會選擇 if 判斷式中是「正向」，比較不會想錯

//   if (err) {
//     // 處理錯誤的地方
//     console.error('發生錯誤了', err);
//   } else {
//     // err = null
//     // if(null) -> false
//     // 在處理正確的地方
//     console.log('執行成功:', data);
//   }

//   // err = null
//   // if(err) -> if(null) -> false
//   // if(!err) -> if(!null) -> true
//   if (!err) {
//     // 在處理正確的地方
//   } else {
//     // 處理錯誤的地方
//   }
// });

// doWork('刷牙', 3000, function (err, data) {
//   // 看一下 if-else 中分別要處理的程式哪個比較短
//   // 而且 if-else 後沒有其他工作
//   // 這樣的話，會把比較短的放上面，然後就接一個 return (early return)
//   if (err) {
//     // 處理錯誤的地方
//     console.error('發生錯誤了', err);
//     return;
//   }

//   // 在處理正確的地方
//   console.log('執行成功:', data);
//   // doWork....
// });