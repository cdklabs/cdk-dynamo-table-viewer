const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  defaultReleaseBranch: 'master',
  repositoryUrl: 'https://github.com/cdklabs/cdk-dynamo-table-viewer.git',
  name: 'cdk-dynamo-table-viewer',
  description: 'An AWS CDK construct which exposes an endpoint with the contents of a DynamoDB table',
  authorName: 'Elad Ben-Israel',
  authorEmail: 'elad.benisrael@gmail.com',
  authorUrl: 'https://github.com/eladb',

  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  cdkVersion: '2.60.0',
  minNodeVersion: '14.17.0',

  devDeps: ['ts-node', 'aws-cdk-lib', 'constructs', '@aws-sdk/client-dynamodb'],
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

  autoApproveOptions: {
    allowedUsernames: ['cdklabs-automation'],
    secret: 'GITHUB_TOKEN',
  },
  depsUpgradeOptions: {
    exclude: ['aws-cdk-lib', 'constructs'],
  },
  autoApproveUpgrades: true,
});

project.synth();
