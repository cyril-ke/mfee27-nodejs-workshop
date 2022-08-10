// 目標：因物價上漲，每個價錢都漲五元
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

// map()
function addPrice() {
    menu.map(prices => prices.price += 5);
    return menu;
}

// for-loop map()
function map() {
    for (let i = 0; i < menu.length; i++) {
        menu[i].price += 5;
    }
    return menu;
}

// map()
console.log(addPrice()); // [{ item: 'Black tea', price: 40 }, { item: 'Green tea', price: 35 }, { item: 'Oolong tea', price: 45 }]

// for-loop map()
console.log('for-loop map()')
console.log(map()) // [{ item: 'Black tea', price: 40 }, { item: 'Green tea', price: 35 }, { item: 'Oolong tea', price: 45 }]