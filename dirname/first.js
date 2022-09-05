const fs = require('fs/promises');

console.log('first', __dirname)

fs.readFile('stock.txt', 'utf-8')
.then((result) => {
  console.log('first', result);
})
.catch((e)=>{
  console.error('first', e);
});