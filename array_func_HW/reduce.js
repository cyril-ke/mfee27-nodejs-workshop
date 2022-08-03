// 目標：計算三杯飲料總價
let menu = [
    {
        item: 'Black tea',
        price: 35
    },
    {
        item: 'Green tea',
        price: 30
    },
    {
        item: 'Oolong tea',
        price: 40
    }
];

function totalPrices() {
    let total = menu.reduce((acc, cur) => acc + cur.price, 0);
    return total;
}

// for-loop reduce()
function reduce() {
    let totalPrice = 0;
    for (let i = 0; i < menu.length; i++){
        totalPrice += menu[i].price;
    }
    return totalPrice;
}


// reduce()
console.log(totalPrices()) //105

// for-loop reduce()
console.log('for-loop reduce()')
console.log(reduce()) //105