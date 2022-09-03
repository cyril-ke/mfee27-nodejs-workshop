// exports = module.exports = {};
// 若觀念不夠清楚，請不要用 exports ，很容易踩入空記憶體的雷

// let car = {
//   name: 'aaa',
//   getName: function () {
//     return 'BBB'
//   },
//   age: 18,
// }

// 現在流行寫法
// exports = module.exports = {};

let name = "AAAA";

function getName() {
  return name;
}

module.exports = {
  getName,
};

// return module.exports;

// exports = car;

// return module.exports;
