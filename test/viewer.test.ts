import { Stack, App } from '@aws-cdk/cdk';
import dynamodb = require('@aws-cdk/aws-dynamodb');
import { TableViewer } from '../lib';

test('happy  flow', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test');
  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.String }
  });

  // WHEN
  new TableViewer(stack, 'viewer', { table });

  // THEN
  expect(app.synthesizeStack('test').template).toMatchSnapshot();
});