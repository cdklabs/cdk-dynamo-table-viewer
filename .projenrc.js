const { AwsCdkConstructLibrary } = require('projen');

const project = new AwsCdkConstructLibrary({
  defaultReleaseBranch: 'master',
  repositoryUrl: 'https://github.com/cdklabs/cdk-dynamo-table-viewer.git',
  name: 'cdk-dynamo-table-viewer',
  authorName: 'Elad Ben-Israel',
  authorEmail: 'elad.benisrael@gmail.com',
  authorUrl: 'https://github.com/eladb',

  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  cdkVersion: '1.106.0',
  cdkDependencies: [
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/core',
  ],

  devDeps: ['ts-node'],

  catalog: {
    twitter: 'emeshbi',
  },

  publishToMaven: {
    javaPackage: 'com.github.eladb.dynamotableviewer',
    mavenGroupId: 'com.github.eladb',
    mavenArtifactId: 'cdk-dynamo-table-view',
  },

  publishToPypi: {
    distName: 'cdk-dynamo-table-view',
    module: 'cdk_dynamo_table_view',
  },

  publishToNuget: {
    dotNetNamespace: 'Eladb.DynamoTableViewer',
    packageId: 'Eladb.DynamoTableViewer',
  },
});

project.synth();