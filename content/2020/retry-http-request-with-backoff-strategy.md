---
aliases:
  - /retry-http-request-with-backoff-strategy/
date: "2020-07-12"
description: "Retrying HTTP Requests when network fails due to poor connection or server timeouts"
slug: "retry-http-request-with-backoff-strategy"
tags:
  - "programming"
title: "Retry HTTP Request with Backoff Strategy"
---


![Girl Trapped Sketch]


If you have engineered server-side services or client-side applications, you will know that HTTP Requests are constantly made to APIs from client-side to server-side and from server-side to third-party services.

Unfortunately, networks might fail randomly due to poor network connection or server timeout affecting client application behavior and if the information from the server is critical, users are forced to refresh the application which could have a negative impact on the current application state or session.

If you rely on third-party services like [SendGrid][] or [Twilio][] for sending emails or SMS to your users respectively, your HTTP Request might fail with 503 Service Unavailable message and you definitely want to retry this sort of HTTP Request.

Retrying HTTP Request makes our application more stable and a reliable strategy is using combination of a timeout and some retry condition checking HTTP Status Code to retry the HTTP Request with the exact request payload. This strategy is especially useful for preventing users from manually refreshing the application and retrying critical requests that are required for your services *i.e. sending emails or SMS*.


# How?

In some languages or third-party libraries, you can simply retry the HTTP Request using some method and/or configuration which will automatically retry the HTTP Request when an error occurs. But, I will show an example retry logic with [Exponential Backoff][] strategy in JavaScript that will retry HTTP Request after several failed attempts before giving up.

In-depth explanation immediately after the code below. Read on [Asynchronous][] and [Promises][] in JavaScript, if you don't know about those concepts.

```javascript
// filename: http-retry.js

/**
 * @param {Function} fn               - set function wrapping HTTP Request
 *                                       returning a Promise.
 * @param {Function} retryCondition   - Optional function should return Boolean.
 *                                      If true, will retry HTTP Request otherwise
 *                                      fails with any known HTTP Request error.
 * @param {Number} times              - sets number of HTTP Request retry. Default 3
 * @param {Number} intervalMs         - sets number of miliseconds that should
 *                                      elapse before retrying HTTP Request. Default 100
 * @param {Number} backoff            - set number to increase intervalMs
                                        exponentially after each failed retry. Default 2
 * @param {Function} setTimeoutFn     - Override with custom setTimeout logic.
 * @return {Promise}
**/
module.exports = function httpRetry({
  fn,
  retryCondition,
  times = 3,
  intervalMs = 100,
  backoff = 2,
  setTimeoutFn = setTimeout,
}) {
  let attempt = 0;
  let tryAgainIn = intervalMs;
  const setTimeoutAsync = (targetFn, timeout) =>
    new Promise((resolve, reject) => {
      setTimeoutFn(() => {
        targetFn()
          .then(resolve)
          .catch(reject);
      }, timeout);
    });

  function tryFn() {
    return fn()
      .catch((error) => {
        if (retryCondition && !retryCondition(error)) {
          throw error;
        }

        if (attempt >= times) {
          console.log(`Operation failed, tried ${attempt} times, will not retry`);
          throw error;
        }

        console.log(error, `Operation failed, attempt ${attempt}, will retry in ${tryAgainIn}ms`);
        const result = setTimeoutAsync(tryFn, tryAgainIn);
        attempt += 1;
        tryAgainIn *= backoff;
        return result;
      });
  }

  return tryFn();
};
```

`<Function>httpRetry` retries failed HTTP Requests and increase the delay at successive intervals to avoid network congestion (*i.e. one second, two seconds, four seconds, eight seconds, and so on*) until max retry, `<Number>times` is reached.

If a successful HTTP Response does not occur within the `<Number>times` specified, `<Function>httpRetry` will stop trying to connect to the Request URL and exit with any known HTTP Request error.


## Snippets Explanation

```javascript
let attempt = 0;
let tryAgainIn = intervalMs;
const setTimeoutAsync = (targetFn, timeout) =>
  new Promise((resolve, reject) => {
    setTimeoutFn(() => {
      targetFn()
        .then(resolve)
        .catch(reject);
    }, timeout);
  });
```

- `<Number>attempt` keeps the incrementing HTTP retry count on every HTTP Response error.
- `<Number>tryAgainIn` keeps the exponential incrementing value of `<Number>intervalMs` by `<Number>backoff` on every HTTP Response error *i.e. 100 x 2 -> 200 x 2 -> 400*.

`<Function>setTimeoutAsync` accepts two parameters and returns a Promise after executing `<Function>targetFn` that either resolves or rejects.

- `<Function>targetFn` refers to `<Function>tryFn` execution at intervals.
- `<Number>timeout` indicates how many milliseconds should elapse before triggering `<Function>setTimeoutFn`.

```javascript
function tryFn() {
  return fn()
    .catch((error) => {
      if (retryCondition && !retryCondition(error)) {
        throw error;
      }

      if (attempt >= times) {
        console.log(`Operation failed, tried ${attempt} times, will not retry`);
        throw error;
      }

      console.log(error, `Operation failed, attempt ${attempt}, will retry in ${tryAgainIn}ms`);
      const result = setTimeoutAsync(tryFn, tryAgainIn);
      attempt += 1;
      tryAgainIn *= backoff;
      return result;
    });
}

return tryFn();
```

`<Function>tryFn` will recursively[^1] return a Promise that resolves if any attempt succeeds or rejects if all attempts failed. If `<Function>retryCondition` fails any known HTTP Request error is thrown, otherwise `<Function>setTimeoutAsync` will execute with `<Function>tryFn` and `<Number>tryAgainIn`.

`<Function>tryFn` recursion base case[^2] will check if `<Number>attempt` is greater than or equal to `<Number>times`, an error is thrown if true.


## Run the code

Using [Axios](https://github.com/axios/axios), a third-party module that wraps around built-in HTTP Request to handle parsing JSON response, returning a Promise interface, and keeping the code simple.

```javascript
// filename: index.js

const axios = require('axios');
const httpRetry = require('./http-retry');

module.exports = function sendHTTPRequest(opts) {
  const options = {
    retryStrategy: {
      times: 3,
      intervalMs: 100,
      backoff: 2,
      retryCondition: (error) => {
        if (error.response.status >= 500) return true;
        return false;
      },
    },
    ...opts,
  };

  // send HTTP Request with configuration options
  const doRequest = () =>
    Promise.resolve(options)
      .then((reqOpts) => axios(reqOpts));

  if (options.retryStrategy) {
    return httpRetry({
      fn: doRequest,
      ...options.retryStrategy,
    });
  }

  return doRequest();
}
```

Running a test script against `<Function>sendHTTPRequest` with mock 500 Internal Server Error and finally 200 OK response:

```javascript
// filename: index.spec.js

const faker = require('faker');
const nock = require('nock');
const axios = require('axios');
const path = require('path');
const lib = path.join(path.dirname(require.resolve('axios')), 'lib/adapters/http');
const http = require(lib);
const sendHTTPRequest = require('index');

// Manual Test
// sendHTTPRequest({
//   method: 'GET',
//   url: 'http://jsonplaceholder.typicode.com/users',
// }).then(console.log);

// Unit Test with Jest
test('should retry request and get 200 on attempt number three', function (done) {
  const serviceUrl = faker.internet.url();
  const apiPath = faker.fake('/v1/api-{{lorem.word}}');
  const apiUrl = serviceUrl + apiPath;
  const result = faker.lorem.words();
  const apiCall = nock(serviceUrl)
    .get(apiPath)
    .reply(500)
    .get(apiPath)
    .reply(500)
    .get(apiPath)
    .reply(200, result);

  sendHTTPRequest({
    // change axios adapter to http for test
    // due to Jest "Network Error" error
    adapter: http,
    method: 'GET',
    url: apiUrl,
  })
  .then((result) => {
    expect(status).toEqual(200);
    expect(data).toEqual(result);
    expect(apiCall.isDone()).toEqual(true);
    done();
  });
});
```

In the test script, `<Object>apiCall` simulate an HTTP Server which fails on the first two attempts and returns a response on the third attempt.


# Alternatives

The implementation and explanation above are just for knowledge and I know it's quite complex but you should definitely read this article again if it's not comprehensible and/or mail me if you have questions.

If you want to use this HTTP retry strategy in production I'd suggest using a well-known package if you can't handle certain edge cases. I'd recommend any of these third-party modules from npm library:

- [async-retry][]
- [axios-retry][]
- [node-retry][]
- [p-retry][]
- [promise-retry][]

  [^1]: [Recursion in Computer Science][] occurs when a procedure calls itself until reaching a terminating condition.
  [^2]: Base case (or cases) a terminating condition in a recursive procedure *i.e. `Fib(n) = 1 as base case` will terminate the procedure when `<Number>n` equals one*

  [Girl Trapped Sketch]: /static/images/2020/girl-trapped-sketch.jpg "Girl Trapped Sketch"
  [SendGrid]: https://sendgrid.com "Email Delivery Service | SendGrid"
  [Twilio]: https://www.twilio.com "Twilio - Communication APIs for SMS, Voice, Video and Authentication"
  [Exponential Backoff]: https://en.wikipedia.org/wiki/Exponential_backoff "Exponential Backoff - Wikipedia"
  [Asynchronous]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous "Asynchronous JavaScript | MDN"
  [Promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise "JavaScript | MDN"
  [Recursion in Computer Science]: https://en.wikipedia.org/wiki/Recursion_(computer_science) "Recursion (computer science) - Wikipedia"
  [async-retry]: https://github.com/zeit/async-retry "GitHub - zeit/async-retry"
  [axios-retry]: https://github.com/softonic/axios-retry "GitHub - softonic/axios-retry"
  [node-retry]: https://github.com/tim-kos/node-retry "GitHub - tim-kos/node-retry"
  [p-retry]: https://github.com/sindresorhus/p-retry "GitHub - sindresorhus/p-retry"
  [promise-retry]: https://github.com/IndigoUnited/node-promise-retry "GitHub - IndigoUnited/node-promise-retry"
