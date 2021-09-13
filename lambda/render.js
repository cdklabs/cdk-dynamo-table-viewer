const stylesheet = require('./stylesheet');

module.exports = function(props) {
  const title = props.title;
  let sort = props.sort;

  let items = props.items || [];
  if (sort) {
    let desc = false;
    if (sort.startsWith('-')) {
      sort = sort.substr(1);
      desc = true;
    }

    items = items.sort((i1, i2) => {
      const result = compare(i1, i2);
      return desc ? -1 * result : result;
    });

    function compare(i1, i2) {
      const v1 = i1[sort];
      const v2 = i2[sort];
      if (v1 && v2 && v1.N && v2.N) {
        return v1.N - v2.N;
      }

      return getAttribute(i1, sort).localeCompare(getAttribute(i2, sort));
    }
  }

  const headers = collectHeaders()

  return `
  <!DOCTYPE html>
  <html>

  <head>
    ${ title ? `<title>${title}</title>` : '' }
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="10">

    <style>${stylesheet}</style>
  </head>

  <body>
    <div class="nice-table">
        ${ title ? `<div class="header">${title}</div>` : '' }

        <table cellspacing="0">
          ${ renderHeaderRow() }
          ${ items.map(item => renderItemRow(item)).join('\n') }
        </table>
    </div>
  </body>

  </html>
  `;

  function renderHeaderRow() {
    return `
    <tr>
      ${ headers.map(header => `<th>${header}</th>`).join('\n') }
    </tr>
    `;
  }

  function renderItemRow(item) {
    return `
    <tr>
      ${ headers.map(header => `<td>${renderAttribute(item, header)}</td>`).join('\n') }
    </tr>
    `
  }

  function renderAttribute(item, attribute) {
    return getAttribute(item, attribute).toString();
  }

  function getAttribute(item, attribute) {
    if (!(attribute in item)) {
      return '';
    }

    const type = Object.keys(item[attribute]);
    return item[attribute][type];
  }

  // iterate over all items and create a union of all keys for table headers
  function collectHeaders() {
    const headerSet = new Set();
    for (const item of items) {
      for (const key of Object.keys(item)) {
        headerSet.add(key);
      }
    }

    return Array.from(headerSet).sort();
  }

  function isNumber(v) {
    return (parseInt(v).toString() === v.toString());
  }
}