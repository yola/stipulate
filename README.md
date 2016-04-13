# stipulate
A module extending the Fetch API with some useful default error handling and hooks.

[![Build Status](https://travis-ci.org/yola/stipulate.svg?branch=master)](https://travis-ci.org/yola/stipulate)
[![Coverage Status](https://coveralls.io/repos/github/yola/stipulate/badge.svg?branch=master)](https://coveralls.io/github/yola/stipulate?branch=master)

Stipulate assumes the presence of a global `fetch`, in accordance with the [Fetch API spec](https://fetch.spec.whatwg.org/). If you are 
using `fetch` and find yourself repeating configuration all over the place, Stipulate is here to help. A lot of
the options you'll use with Stipulate correspond directly to ones used by fetch, so familiarity with the spec is
helpful.

## Usage

When you create an instance of Stipulate with an `options` object like one you'd send to fetch,
those options get saved and sent with every request fired off from the instance.
```js
import Stipulate from 'stipulate';

const options = {
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

const stipulations = new Stipulate(options);

const responsePromise = stipulations.send('/some/endpoint');
// request includes above options
```

If you need to extend the options fed to the instance on creation, you can send more.
```js
const moreOpts = {
  headers: {
    'Cache-Control': 'no-cache'
  }
};

const responsePromise = stipulations.send('/some/endpoint', moreOpts);
//  {
//    credentials: 'same-origin',
//    headers: {
//      'Accept': 'application/json',
//      'Cache-Control': 'no-cache',
//      'Content-Type': 'application/json'
//    }
//  }
```

If you want to leave out a header you set in the base options, you can override it with `null` or `''`.
```js
const removeAccept = {
  headers: {
    'Accept': null
  }
};

const responsePromise = stipulations.send('/some/endpoint', removeAccept);
//  {
//    credentials: 'same-origin',
//    headers: {
//      'Content-Type': 'application/json'
//    }
//  }
```

You can also include a query parameters object as the third argument, which will get resolved (with priority) onto
the url you provided. Like headers, you can override query params from the url by passing `null` or `''` values
to `Stipulate.send`.
```js
const query = {
  foo: '',
  zip: 'zap'
};

const response = stipulations.send('/some/endpoint?foo=bar&fizz=buzz', null, query);
// will hit the url: "/some/endpoint?fizz=buzz&zip=zap"
```

### Errors

By default, Stipulate throws responses with non 2XX status codes. There are two ways to modify this
behavior:

1) pass an `okCodes` array of status codes that are acceptable (beyond 2XX; this array extends that range)
with other options at any point you would normally pass options

```js
const foo = new Stipulate({ okCodes: [401, 403] });
// requests send via foo.send will not throw 2XX, 401, or 403 responses
const bar = new Stipulate();

bar.send('/some/endpoint', { okCodes: [404] });
// singular request will not throw a response with status code of 2XX or 404

foo.send('/some/endpoint', { okCodes: [500] });
```

2) pass a `test` function with other options at any point you'd normally pass options.

```js
// e.g., to get fetch's normal behavior of fulfilling every request, regardless of success:
// (unless there's a network error)
const neverReject = function(response) {
  return response;
};

const stipulation = new Stipulate({ test: neverReject });
// OR
const foo = new Stipulate();
foo.send('/some/endpoint', { test: neverReject });
```

### Extending Stipulate with pre- and post-send methods

If you'd like to add some sort of transform or action to either the front or back of all your requests,
you've got two options:

1) Extend the class, so every instance uses the hooks.

```js
import Stipulate from 'stipulate';

class Foo extends Stipulate {
  beforeRequest(url, options) {
    // do work on url, or options, or both
    ...
    return [url, options];
  }

  afterResponse(response) {
    // do something with the response
    ...
    return resultOfYourWork;
  }
}

const bar = new Foo();
const responsePromise = bar.send('/some/endpoint');
```

2) Modify an instance, so other instances don't also use the hook.

```js
const foo = new Stipulate();
const bar = new Stipulate();

foo.beforeRequest = (url, options) => {
  ...
};

const fooResponse = foo.send('/some/endpoint');
const barResponse = bar.send('/some/endpoint');
// same as above except without foo's beforeRequest results
```

An example use of the two would be a request factory that's going to send and receive json data by default:
```js
class JsonStipulate extends Stipulate {
  beforeRequest(url, options) {
    if(typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }

    return [url, options];
  }

  afterResponse(response) {
    return response.json();
  }
}

const jsonStipulation = new JsonStipulate();

jsonStipulation.send('/some/resource.json')
  .then((jsonResponse) => {
    // if the request was successful, the response is already parsed
    ,,,
  });

const payload = {
  method: 'POST',
  body: { foo: 'bar', fizz: 'buzz' }
};

jsonStipulate.send('/some/endpoint', payload); // beforeRequest will stringify body for you
```
