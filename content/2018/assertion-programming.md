---
aliases:
  - /assertion-programming/
date: "2018-09-16"
description: "What if assertions can be written just like every line of code you write?"
slug: "assertion-programming"
tags:
  - "programming"
  - "personal development"
title: "Assertion Programming"
---


![Wolf Fighting Sketch][]


Before now, programmers solve business requirements by churning out code and write test cases (unit tests, integration tests or even load and stress tests) — usually in separate files — to assert the code written. All these tests just to ensure the program behaves as expected, meet business requirements and if dealing with figures (i.e. transactional programs), verifying the figures passes the test cases and expected assertions when the program runs.

What if:

- there was no separate test file or test case?
- assertions can be written alongside your programs and committed to a version control system?
- you have smart assertions within your program that detects server environment and runs accordingly?
- the assertions emit errors and fail when conditions set isn’t satisfied?

Below an example [Class] Car requires an attributes argument to instantiate:

```javascript
function Car(attributes) {
  attributes = attributes || this.attributes || {}

  if (typeof attributes !== 'object') {
    throw new Error('.attributes is object only')
  }

  var required = ['owner', 'brand', 'type', 'year']

  var valid = required.every(function(attribute, index) {
    if (! (attributes[required[index]]) ) {
      return false
    }

    return true
  })

  if (!valid) {
    throw new TypeError('.attributes requires owner,brand,type,year')
  }

  return Object.assign(this, attributes)
}

test('#Car should not instantiate without required attributes', function(t) {
  t.throws(new Car({
    owner: 'Akinjide'
  }))
})
```

```javascript
Error: .attributes requires owner,brand,type
    at new Car (evalmachine.<anonymous>:9:11)
    at evalmachine.<anonymous>:15:1
    at Script.runInContext (vm.js:74:29)
    at Object.runInContext (vm.js:182:6)
    at evaluate (/run_dir/repl.js:133:14)
    at ReadStream.<anonymous> (/run_dir/repl.js:116:5)
    at ReadStream.emit (events.js:180:13)
    at addChunk (_stream_readable.js:274:12)
    at readableAddChunk (_stream_readable.js:261:11)
    at ReadStream.Readable.push (_stream_readable.js:218:10)
```

Here, by checking if the argument `attributes` has the required properties while iterating, the program throws an error if any attribute is missing. The example above works but looks messy and might be poor on performance, in my opinion, one might argue it works but this isn't beginner friendly and requires experience to write and if left in this state will become legacy.

Asserting within our program, we can check if the property is defined and throw errors if not. Below an example of assertion using Node.js [Assert] module, which provides a simple set of assertion tests that can be used:

```javascript
var assert = require('assert')

function Car(attributes) {
  attributes = attributes || this.attributes || {}

  // required
  assert(typeof attributes == 'object', '.attributes is object only')
  assert(attributes.owner, '.owner required')
  assert(attributes.brand, '.brand required')
  assert(attributes.type, '.type required')
  assert(attributes.year, '.year required')

  return Object.assign(this, attributes)
}

console.log(
  new Car({
    owner: 'Akinjide',
    brand: 'Ford',
    type: 'Mustang Shelby GT500KR'
  })
)
```


```javascript
AssertionError [ERR_ASSERTION]: .year required
    at new Car (evalmachine.<anonymous>:7:3)
    at evalmachine.<anonymous>:13:13
    at Script.runInContext (vm.js:74:29)
    at Object.runInContext (vm.js:182:6)
    at evaluate (/run_dir/repl.js:133:14)
    at ReadStream.<anonymous> (/run_dir/repl.js:116:5)
    at ReadStream.emit (events.js:180:13)
    at addChunk (_stream_readable.js:274:12)
    at readableAddChunk (_stream_readable.js:261:11)
    at ReadStream.Readable.push (_stream_readable.js:218:10)
```

We can perform advance assertions and using [process] environment we can disable assert on a production server like below:

```javascript
function Car(attributes) {
  attributes = attributes || this.attributes || {}

  if (process.env.NODE_ENV != 'production') {
    // required
    assert(typeof attributes == 'object', '.attributes is object only')

    assert(attributes.owner, '.owner required')
    assert(attributes.brand, '.brand required')
    assert(attributes.type, '.type required')
    assert(attributes.year, '.year required')

    assert(attributes.year.length == 4, '.year cannot be greater than 4')
    assert(typeof attributes.brand == 'string', '.brand is string only')
    assert(attributes.owner.length > 2, '.owner cannot be less than 2')
  }

  return Object.assign(this, attributes)
}

console.log(
  new Car({
    owner: 'Akinjide',
    brand: 'Ford',
    type: 'Mustang Shelby GT500KR'
  })
)
```

Below [NodeRedis][] shows using the assert module for error handling:

```javascript
client.on('error', function (err) {
  assert(err instanceof Error);
  assert(err instanceof redis.AbortError);
  assert(err instanceof redis.AggregateError);
  // The set and get get aggregated in here
  assert.strictEqual(err.errors.length, 2);
  assert.strictEqual(err.code, 'NR_CLOSED');
});

client.set('foo', 123, 'bar', function (err, res) { // Too many arguments
  assert(err instanceof redis.ReplyError); // => true
  assert.strictEqual(err.command, 'SET');
  assert.deepStrictEqual(err.args, ['foo', 123, 'bar']);

  redis.debug_mode = true;
  client.set('foo', 'bar');
  client.get('foo');
  process.nextTick(function () {
    // Force closing the connection while the command did not yet return
    client.end(true);
    redis.debug_mode = false;
  });
});
```

Imagine a full project built out of this way. I'm currently adopting assertion within new programs I write because it's just efficient.


## Thoughts

I'm happy you had a chance to read this article about assertion programming, these are my thoughts and I hope you understand and clearly see why you (probably) should use or extend it and make better.

Many programming languages have built-in support for assertions. If your language is missing assertions and you'd like to create an external or internal library, you can start with the snippet below in Node.js:

```javascript
function Assert(condition, message) {
  if (process.env.NODE_ENV && ['test', 'dev', 'development'].includes(process.env.NODE_ENV)) {
    if (!(condition)) {
      console.log("Assertion Failed: ", condition, message)
      process.exit(1)
    }
  }
}
```

Have a question? [Shoot me an email.][]

  [Wolf Fighting Sketch]: /static/images/2018/wolf-fighting-sketch.jpg "Wolf Fighting Sketch"
  [Class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Boxing_with_prototype_and_static_methods "Classes - JavaScript"
  [Assert]: https://nodejs.org/dist/latest-v10.x/docs/api/assert.html#assert_assert_value_message "Assert | Node.js Documentation"
  [process]: https://nodejs.org/dist/latest-v10.x/docs/api/process.html "Process | Node.js Documentation"
  [NodeRedis]: https://github.com/NodeRedis/node_redis#error-handling--v26 "redis client for node http://redis.js.org/"
  [Shoot me an email.]: mailto:r@akinjide.me "Akinjide Bankole' Email"
