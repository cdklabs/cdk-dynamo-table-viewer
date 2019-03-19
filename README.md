# cdk-dynamo-table-viewer

An AWS CDK construct which exposes a public HTTP endpoint which displays an HTML
page with the contents of a DynamoDB table in your stack.

__SECURITY NOTE__: this construct was built for demonstration purposes and
using it in production is probably a really bad idea. It exposes the entire
contents of a DynamoDB table in your account to the general public.

## Usage

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
- Supports CDK version 0.25.3

## License

Apache 2.0
