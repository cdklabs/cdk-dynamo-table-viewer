import { CdklabsConstructLibrary } from 'cdklabs-projen-project-types';

const project = new CdklabsConstructLibrary({
  defaultReleaseBranch: 'master',
  projenrcTs: true,
  enablePRAutoMerge: true,
  private: false,
  repositoryUrl: 'https://github.com/cdklabs/cdk-dynamo-table-viewer.git',
  name: 'cdk-dynamo-table-viewer',
  description: 'An AWS CDK construct which exposes an endpoint with the contents of a DynamoDB table',

  author: 'Amazon Web Services',
  authorAddress: 'aws-cdk-dev@amazon.com',

  cdkVersion: '2.60.0',
  minNodeVersion: '16.14.0',
  workflowNodeVersion: '16.x',

  devDeps: [
    'ts-node@^10.8.1',
    'aws-cdk-lib',
    'constructs',
    '@aws-sdk/client-dynamodb',
    'cdklabs-projen-project-types',
  ],
  peerDeps: ['aws-cdk-lib', 'constructs'],

  catalog: {
    twitter: 'emeshbi',
  },

  publishToMaven: {
    javaPackage: 'io.github.cdklabs.dynamotableviewer',
    mavenGroupId: 'io.github.cdklabs',
    mavenArtifactId: 'cdk-dynamo-table-view',
    mavenEndpoint: 'https://s01.oss.sonatype.org',
  },

  publishToPypi: {
    distName: 'cdk-dynamo-table-view',
    module: 'cdk_dynamo_table_view',
  },

  publishToNuget: {
    dotNetNamespace: 'Cdklabs.DynamoTableViewer',
    packageId: 'Cdklabs.DynamoTableViewer',
  },

  publishToGo: {
    moduleName: 'github.com/cdklabs/cdk-dynamo-table-viewer-go',
    packageName: 'dynamotableviewer',
  },

  depsUpgradeOptions: {
    exclude: ['aws-cdk-lib', 'constructs'],
  },
});

project.synth();
