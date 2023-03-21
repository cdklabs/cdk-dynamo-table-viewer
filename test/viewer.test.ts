import { Stack, App } from 'aws-cdk-lib';
import * as assertions from 'aws-cdk-lib/assertions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { TableViewer } from '../src';

test('happy  flow', () => {
  // GIVEN
  const app = new App();
  const stack = new Stack(app, 'test');
  const table = new dynamodb.Table(stack, 'MyTable', {
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  });

  // WHEN
  new TableViewer(stack, 'viewer', { table });

  // THEN
  const template = assertions.Template.fromStack(stack);

  // keeping this so that we can compare changes for v2 upgrade
  expect(template).toMatchSnapshot();

  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
    Environment: {
      Variables: {
        SORT_BY: '',
        TABLE_NAME: {
          Ref: 'MyTable794EDED1',
        },
        TITLE: '',
      },
    },
    Runtime: 'nodejs18.x',
  });
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'ViewerEndpoint',
  });
  template.hasResourceProperties('AWS::ApiGateway::Stage', {
    StageName: 'prod',
  });
  template.hasResourceProperties('AWS::ApiGateway::Resource', {
    PathPart: '{proxy+}',
  });

  template.resourceCountIs('AWS::ApiGateway::Method', 2);
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'ANY',
    Integration: {
      IntegrationHttpMethod: 'POST',
      Type: 'AWS_PROXY',
    },
  });
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyName: 'viewerRenderedServiceRoleDefaultPolicy196964DF',
    PolicyDocument: {
      Statement: assertions.Match.arrayWith([
        {
          Action: [
            'dynamodb:BatchGetItem',
            'dynamodb:GetRecords',
            'dynamodb:GetShardIterator',
            'dynamodb:Query',
            'dynamodb:GetItem',
            'dynamodb:Scan',
            'dynamodb:ConditionCheckItem',
            'dynamodb:DescribeTable',
          ],
          Effect: 'Allow',
          Resource: assertions.Match.arrayWith([
            {
              'Fn::GetAtt': ['MyTable794EDED1', 'Arn'],
            },
          ]),
        },
      ]),
      Version: '2012-10-17',
    },
    Roles: [{
      Ref: 'viewerRenderedServiceRole7AE70B4C',
    }],
  });
  template.resourceCountIs('AWS::DynamoDB::Table', 1);
  template.resourceCountIs('AWS::ApiGateway::Account', 1);
  template.resourceCountIs('AWS::ApiGateway::Deployment', 1);
  template.resourceCountIs('AWS::IAM::Role', 2);
  template.resourceCountIs('AWS::Lambda::Permission', 4);
});
