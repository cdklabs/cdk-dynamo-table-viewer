const { DynamoDB } = require('aws-sdk');
const render = require('./render');

exports.handler = async function(event) {
  console.log('request:', JSON.stringify(event, undefined, 2));

  const dynamo = new DynamoDB();

  const resp = await dynamo.scan({
    TableName: process.env.TABLE_NAME,
  }).promise();

  const html = render({
    items: resp.Items,
    title: process.env.TITLE,
    sort: process.env.SORT_BY,
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: html
  };
};