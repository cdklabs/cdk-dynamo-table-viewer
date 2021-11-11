# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### TableViewer <a name="cdk-dynamo-table-viewer.TableViewer"></a>

Installs an endpoint in your stack that allows users to view the contents of a DynamoDB table through their browser.

#### Initializers <a name="cdk-dynamo-table-viewer.TableViewer.Initializer"></a>

```typescript
import { TableViewer } from 'cdk-dynamo-table-viewer'

new TableViewer(parent: Construct, id: string, props: TableViewerProps)
```

##### `parent`<sup>Required</sup> <a name="cdk-dynamo-table-viewer.TableViewer.parameter.parent"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk-dynamo-table-viewer.TableViewer.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk-dynamo-table-viewer.TableViewer.parameter.props"></a>

- *Type:* [`cdk-dynamo-table-viewer.TableViewerProps`](#cdk-dynamo-table-viewer.TableViewerProps)

---



#### Properties <a name="Properties"></a>

##### `endpoint`<sup>Required</sup> <a name="cdk-dynamo-table-viewer.TableViewer.property.endpoint"></a>

```typescript
public readonly endpoint: string;
```

- *Type:* `string`

---


## Structs <a name="Structs"></a>

### TableViewerProps <a name="cdk-dynamo-table-viewer.TableViewerProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { TableViewerProps } from 'cdk-dynamo-table-viewer'

const tableViewerProps: TableViewerProps = { ... }
```

##### `table`<sup>Required</sup> <a name="cdk-dynamo-table-viewer.TableViewerProps.property.table"></a>

```typescript
public readonly table: Table;
```

- *Type:* [`aws-cdk-lib.aws_dynamodb.Table`](#aws-cdk-lib.aws_dynamodb.Table)

The DynamoDB table to view.

Note that all contents of this table will be
visible to the public.

---

##### `endpointType`<sup>Optional</sup> <a name="cdk-dynamo-table-viewer.TableViewerProps.property.endpointType"></a>

```typescript
public readonly endpointType: EndpointType;
```

- *Type:* [`aws-cdk-lib.aws_apigateway.EndpointType`](#aws-cdk-lib.aws_apigateway.EndpointType)
- *Default:* EDGE

The endpoint type of the [LambdaRestApi](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigateway.LambdaRestApi.html) that will be created.

---

##### `sortBy`<sup>Optional</sup> <a name="cdk-dynamo-table-viewer.TableViewerProps.property.sortBy"></a>

```typescript
public readonly sortBy: string;
```

- *Type:* `string`
- *Default:* No sort

Name of the column to sort by, prefix with "-" for descending order.

---

##### `title`<sup>Optional</sup> <a name="cdk-dynamo-table-viewer.TableViewerProps.property.title"></a>

```typescript
public readonly title: string;
```

- *Type:* `string`
- *Default:* No title

The web page title.

---



