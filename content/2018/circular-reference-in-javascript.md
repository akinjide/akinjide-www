---
aliases:
  - /circular-reference-in-javascript/
date: "2018-02-28"
description: "circular reference, a nightmare?"
slug: "circular-reference-in-javascript"
tags:
  - "programming"
  - "personal development"
title: "Circular Reference in JavaScript"
---


![Dark Angel Sketch][]


Circular reference is a series of references where an object references itself directly or indirectly through a series of objects, resulting in a closed loop, appearing in most computer programming including JavaScript.

Below are examples of direct or indirect, class and closure circular references:

**direct**

```javascript
var user = {
  first_name: 'Akinjide'
};

user.self = user;

console.log(user);
console.log(user.self);
console.log(user.self.self);
// same output, just reference to itself
// { first_name: 'Akinjide', self: [Circular] }
// { first_name: 'Akinjide', self: [Circular] }
// { first_name: 'Akinjide', self: [Circular] }


var x = {};
x.x = x;

console.log(x);
// { x: [Circular] }
```

**indirect**

```javascript
var profile = {
  user: user,
  profile_id: 0090323192
};

console.log(profile);
// { user: { first_name: 'Akinjide', self: [Circular] },
//  profile_id: 0090323192 }
```

**class**

```javascript
function User(name) {
  this.name = name;
  this.self = this;
}

var user = new User('Akinjide');
console.log(user.self.self.self.self.name);
// Akinjide


class User {
  constructor(name) {
    this.name = name;
    this.self = this;
  }
}

var user = new User('Bruce');
console.log(user.self.self.self.self.name);
// Bruce
```

**closure**

```javascript
var foo;

foo = function(arg) {
  if (arg) console.log(arg);
  else foo('name required');
}

foo('Akinjide');
foo();
// Akinjide
// name required
```

Here the function saved in **foo** refers to the `|foo|` variable and implicitly holding reference to itself, creating a **foo** reference. Conserving and referencing **foo** from the function scope, even if it goes out of scope.

So, we'll know [Arrays][] are just Objects and prone to circular reference as well.

```javascript
var arr1 = ['a', 'b'];
arr1.push(arr1);

console.log(arr1);
// [ 'a', 'b', [Circular] ]


var b = [];
var a = [];
a[0] = b;
b[0] = a;

console.log(a);
console.log(b);
// same output, a Circular
// [ [ [Circular] ] ]
// [ [ [Circular] ] ]
```

[JSON.stringify][], transforms a JavaScript value to JSON string by traversing values within. If it encounters a circular reference, it'll just throw an error, otherwise continues forever :(

```javascript
var user = {
  first_name: 'Akinjide'
};

user.self = user;

try {
  JSON.stringify(user);
} catch(e) {
  console.log(e);
}

TypeError: Converting circular structure to JSON
    at JSON.stringify (<anonymous>)
    at repl:2:6
    at Script.runInThisContext (vm.js:65:33)
    at REPLServer.defaultEval (repl.js:246:29)
    at bound (domain.js:370:14)
    at REPLServer.runBound [as eval] (domain.js:383:12)
    at REPLServer.onLine (repl.js:497:10)
    at REPLServer.emit (events.js:165:20)
    at REPLServer.Interface._onLine (readline.js:287:10)
    at REPLServer.Interface._line (readline.js:640:8)
}
```

**JSON.stringify** wrapped within a [try...catch][] statement and specifing a response, should an exception be thrown is indeed one of the simplest ways to detect (probable) circular references.


## Thoughts

Circular reference represents a big problem in computing and can happen in a production application when one piece of code requires result from another and the referenced code needs result from the original code.

This can render the program useless because none of them can return any useful information whatsoever, or might introduce small obscure memory leaks lurking around in random places, especially in older versions of JavaScript engines.

Those are all my thoughts for now. If you’d like to try or use an external library to detect circular reference, use [is][]:

```bash
npm install akinjide/is
```

**Note: With [GC (Mark-and-sweep algorithm)][], circular references are not a problem anymore.**

  [Dark Angel Sketch]: /static/images/2018/dark-angel-sketch.jpg "Dark Angel Sketch"
  [Arrays]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "Array, JavaScript MDN"
  [JSON.stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify "JSON.stringify(), JavaScript MDN"
  [try...catch]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch "try...catch, JavaScript MDN"
  [is]: https://github.com/akinjide/is "type checking for js."
  [GC (Mark-and-sweep algorithm)]: https://en.wikipedia.org/wiki/Tracing_garbage_collection#Na.C3.AFve_mark-and-sweep "Garbage Collection Mark-and-sweep algorithm"
