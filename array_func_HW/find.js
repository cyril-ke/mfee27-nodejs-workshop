// 目標：找出第一個符合 item 為 Green tea 的物件
let teaMenu = [
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

function isGreenTea(tea) {
    return tea.item === 'Green tea';
}


// for-loop find()
function find(teaMenu) {
    for (let i = 0; i < teaMenu.length; i++) {
        if (teaMenu[i].item === 'Green tea') {
            return teaMenu[i];
        }
    }
}

// find()
console.log(teaMenu.find(isGreenTea)); // { item: 'Green tea', price: 30 }

// for-loop find()
console.log('for-loop find()')
console.log(find(teaMenu)); // { item: 'Green tea', price: 30 }