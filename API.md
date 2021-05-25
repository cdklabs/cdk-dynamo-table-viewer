# API Reference

**Classes**

Name|Description
----|-----------
[TableViewer](#cdk-dynamo-table-viewer-tableviewer)|Installs an endpoint in your stack that allows users to view the contents of a DynamoDB table through their browser.


**Structs**

Name|Description
----|-----------
[TableViewerProps](#cdk-dynamo-table-viewer-tableviewerprops)|*No description*



## class TableViewer  <a id="cdk-dynamo-table-viewer-tableviewer"></a>

Installs an endpoint in your stack that allows users to view the contents of a DynamoDB table through their browser.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new TableViewer(parent: Construct, id: string, props: TableViewerProps)
```

* **parent** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[TableViewerProps](#cdk-dynamo-table-viewer-tableviewerprops)</code>)  *No description*
  * **table** (<code>[Table](#aws-cdk-aws-dynamodb-table)</code>)  The DynamoDB table to view. 
  * **sortBy** (<code>string</code>)  Name of the column to sort by, prefix with "-" for descending order. __*Default*__: No sort
  * **title** (<code>string</code>)  The web page title. __*Default*__: No title



### Properties


Name | Type | Description 
-----|------|-------------
**endpoint** | <code>string</code> | <span></span>



## struct TableViewerProps  <a id="cdk-dynamo-table-viewer-tableviewerprops"></a>






Name | Type | Description 
-----|------|-------------
**table** | <code>[Table](#aws-cdk-aws-dynamodb-table)</code> | The DynamoDB table to view.
**sortBy**? | <code>string</code> | Name of the column to sort by, prefix with "-" for descending order.<br/>__*Default*__: No sort
**title**? | <code>string</code> | The web page title.<br/>__*Default*__: No title



