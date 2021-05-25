const render = require('./render');

console.log(render({
  title: 'my-table',
  sort: 'hits',
  items: [
    {
      field1: { S: 'item1.value1' },
      field2: { S: 'item1.value2' },
      hits: { N: 10 },
    },
    {
      field1: { S: 'item2.value1' },
      field3: { S: 'item2.value3' },
      field4: { S: 'item2.value4' },
      hits: { N: 2 },
    },
    {
      hits: { N: 99 }
    }
  ]
}));