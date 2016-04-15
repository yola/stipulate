# stipulate
A module extending the Fetch API with some useful default error handling and data extraction.

[![Build Status](https://travis-ci.org/yola/stipulate.svg?branch=master)](https://travis-ci.org/yola/stipulate)
[![Coverage Status](https://coveralls.io/repos/github/yola/stipulate/badge.svg?branch=master)](https://coveralls.io/github/yola/stipulate?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/yola/stipulate.svg)](https://gemnasium.com/github.com/yola/stipulate)

Stipulate assumes the presence of a global `fetch`, in accordance with the [Fetch API spec](https://fetch.spec.whatwg.org/).

## Usage

Simplest use-case would be fetching json data from an endpoint.
```js
import stipulate from 'stipulate';

stipulate('/some/resource.json')
  .then(console.log.bind(console));

// => { "some": "data" }
```

If you want to do something else, you send options.
```js
import stipulate from 'stipulate';

const options = {
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify(someDataObject)
};

const postResult = stipulate('/some/endpoint', options);
```

If you need to extend options, you can use the `buildOptions` export.
```js
import { buildOptions } from 'stipulate';

const opts = {
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

const moreOpts = {
  headers: {
    'Cache-Control': 'no-cache'
  }
};

const mergedOpts = buildOptions(opts, moreOpts);
//  {
//    credentials: 'same-origin',
//    headers: {
//      'Accept': 'application/json',
//      'Cache-Control': 'no-cache',
//      'Content-Type': 'application/json'
//    }
//  }
```

Null or empty string headers will not be written to merged options. If you pass `buildOptions` two
options objects with the same header, one set to `null` or `""` and the other with a value, order matters.
```js
const nullAcceptHeaderOpts = {
  headers: {
    'Accept': null
  }
};

const  = mergedOpts = buildOptions(nullAcceptHeaderOpts, opts);
// buildOpts gives priority to first option set seen, so this would
// produce:
//  {
//    credentials: 'same-origin',
//    headers: {
//      'Content-Type': 'application/json'
//    }
//  }

buildOptions(opts, nullAcceptHeadersOpts);
// this would produce:
// {
//   credentials: 'same-origin',
//   headers: {
//    'Accept': 'application/json',
//    'Content-Type': 'application/json'
//   }
// }
```

`resolveUrl` is a function for adding query parameters from an object to a url string.
Duplicate keys will get resolved with priority going to values found on the query object.
Like headers, you can override query params from the url by passing `null` or `''` values
for those params in the query object.
```js
const query = {
  foo: '',
  zip: 'zap'
};

resolveUrl('http://some.domain/some/endpoint?foo=bar&fizz=buzz', query);
// returns: "http://some.domain/some/endpoint?fizz=buzz&zip=zap"
```

### Errors

By default, Stipulate rejects responses with non 2XX status codes. There are two ways to modify this
behavior:

1) pass an `okCodes` array of status codes that are acceptable (beyond 2XX; this array extends that range)
as part of your options.
```js
const result = stipulate('/foobar', { okCodes: [401, 403] });
// will not reject 2XX, 401, or 403 responses
```

2) pass a `test` function with your options.

```js
// e.g., to get fetch's normal behavior of fulfilling every request, regardless of success:
// (unless there's a network error)
const neverReject = function(response) {
  return response;
};

const result = stipulate('/foo', { test: neverReject });
```

### Data Extraction

By default, after checking for errors Stipulate will try to extract json from the response to return in a promise.
If you want another data type (text and blob are some examples of other supported response data types) you can
pass a third argument to stipulate, which is the data type's extraction method name (as a string) that you want.
Data extraction methods can be found in the Fetch API spec under the [Body section](https://fetch.spec.whatwg.org/#concept-body-body).
```js
const textResponse = stipulate('/foo', options, 'text');
```

If you don't want any data extraction and just want the error handling, just import `enforceOk` and use it with fetch.
```js
import { enforceOk } from 'stipulate';

const errorFreeResponse = fetch('/foobar', options).then(enforceOk(options));
// enforceOk looks at your options for the "okCodes" or "test" keys
```
