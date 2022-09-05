const fs = require('fs/promises');

console.log('second', __dirname)

fs.readFile('../stock.txt', 'utf-8')
.then((result) => {
  console.log('second', result);
})
.catch((e)=>{
  console.error('second', e);
});