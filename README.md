# cdk-dynamo-table-viewer

An AWS CDK construct which exposes a public HTTP endpoint which displays an HTML
page with the contents of a DynamoDB table in your stack.

__SECURITY NOTE__: this construct was built for demonstration purposes and
using it in production is probably a really bad idea. It exposes the entire
contents of a DynamoDB table in your account to the general public.


The library is published under the following names:

|Language|Repository
|--------|-----------
|JavaScript/TypeScript|[cdk-dynamo-table-viewer](https://www.npmjs.com/package/cdk-dynamo-table-viewer)
|Python|[cdk-dynamo-table-viewer](https://pypi.org/project/cdk-dynamo-table-viewer/)
|.NET|[Eladb.DynamoTableViewer](https://www.nuget.org/packages/Eladb.DynamoTableViewer/)
|Java|[com.github.eladb/cdk-dynamo-table-viewer](https://search.maven.org/artifact/com.github.eladb/cdk-dynamo-table-viewer)
|Go|[github.com/cdklabs/cdk-dynamo-table-viewer-go/dynamotableviewer](https://pkg.go.dev/github.com/cdklabs/cdk-dynamo-table-viewer-go/dynamotableviewer)


## Usage (TypeScript/JavaScript)

Install via npm:

```shell
$ npm i cdk-dynamo-table-viewer
```

Add to your CDK stack:

```ts
import { TableViewer } from 'cdk-dynamo-table-viewer'

const viewer = new TableViewer(this, 'CookiesViewer', {
  table: cookiesTable,
  title: 'Cookie Sales', // optional
  sortBy: '-sales'       // optional ("-" denotes descending order)
});
```

Notes:

- The endpoint will be available (as an deploy-time value) under `viewer.endpoint`.
  It will also be exported as a stack output.
- Paging is not supported. This means that only the first 1MB of items will be
  displayed (again, this is a demo...)
- Supports CDK version 0.38.0 and above

## License

Apache 2.0
