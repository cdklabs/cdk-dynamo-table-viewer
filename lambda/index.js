const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const render = require('./render');

exports.handler = async function(event) {
  console.log('request:', JSON.stringify(event, undefined, 2));

  const dynamo = new DynamoDBClient({ });

  const resp = await dynamo.send(new ScanCommand({
    TableName: process.env.TABLE_NAME,
  }));

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