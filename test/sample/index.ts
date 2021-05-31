import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { Construct, StackProps, Stack, App } from '@aws-cdk/core';
import { TableViewer } from '../../src';

class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'my-table', {
      partitionKey: {
        name: 'id', type: dynamodb.AttributeType.STRING,
      },
    });

    new TableViewer(this, 'viewer', {
      table,
    });
  }
}

const app = new App();
new MyStack(app, 'my-stack');
app.synth();
