import cdk = require('@aws-cdk/core');
import apigw = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import path = require('path');

export interface TableViewerProps {
  /**
   * The DynamoDB table to view. Note that all contents of this table will be
   * visible to the public.
   */
  readonly table: dynamodb.Table;

  /**
   * The web page title.
   * @default - No title
   */
  readonly title?: string;

  /**
   * Name of the column to sort by, prefix with "-" for descending order.
   * @default - No sort
   */
  readonly sortBy?: string;
}

/**
 * Installs an endpoint in your stack that allows users to view the contents
 * of a DynamoDB table through their browser.
 */
export class TableViewer extends cdk.Construct {

  public readonly endpoint: string;

  constructor(parent: cdk.Construct, id: string, props: TableViewerProps) {
    super(parent, id);

    const handler = new lambda.Function(this, 'Rendered', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      environment: {
        TABLE_NAME: props.table.tableName,
        TITLE: props.title || '',
        SORT_BY: props.sortBy || ''
      }
    });

    props.table.grantReadData(handler);

    const home = new apigw.LambdaRestApi(this, 'ViewerEndpoint', { handler });
    this.endpoint = home.url;
  }
}
