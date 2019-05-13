import dynamodb = require('@aws-cdk/aws-dynamodb');
import { TableViewer } from '../lib';
import { Construct, StackProps, Stack, App } from '@aws-cdk/cdk';

class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'my-table', {
      partitionKey: {
        name: 'id', type: dynamodb.AttributeType.String
      }
    });

    new TableViewer(this, 'viewer', {
      table
    });
  }
}

new MyStack(new App(), 'my-stack');
