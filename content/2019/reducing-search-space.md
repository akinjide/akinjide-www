---
aliases:
  - /reducing-search-space/
date: "2019-11-26"
description: "Optimizing a program that generates offsets of any given number."
slug: "reducing-search-space"
tags:
  - "personal development"
  - "programming"
title: "Reducing Search Space"
---


![Madara with Nine Tails Sketch][]


Not long ago, I was tasked to write a program that generates offsets of any given number **(i.e. n = 3)** and this generated offsets **(i.e. a = [2, 3, 4, 5])** will be used to intersect a much bigger list **(i.e. b = [1, 2, 5, 6, 7, 8, 9])**, a, intersects b returning **(i.e. x = [2, 5])**, X will be the result of the intersection.

Although the task took a while to accomplish, I discovered the program's first iteration was not performant, therefore I did research on how best to make it more performant and I'd like to share the research and program iterations in this article.


# First Iteration

The below code is not performant but I utilized [Closures and Lexical scoping][] to accomplish the initial program. Even though the code below uses an [Array][], a similar data structure can be used in replace:

```javascript
function offsetFactory(startWithNumber, count) {
  const createOffset = (number, count) => {
    let result = [];
    let head = number;
    let tail = number;

    for (let j = 0; j <= count; j += 1) {
      if (result.length + 1 === count) {
        result.push(number);
        break;
      }

      if (j % 2 === 0 && head >= 0) {
        head += 1;
        result.push(head);
      } else if (j % 2 === 1 && tail > 0) {
        tail -= 1;
        result.push(tail);
      } else {
        head += 1;
        result.push(head);
      }
    }

    return result.sort((a, b) => a - b);
  };

  const offsets = createOffset(Number(startWithNumber), parseInt(count, 10));
  console.log('offsets: ', offsets);
  // offsets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, …] (100)

  return (searchNumber) => {
    let isMatch = false;

    if (offsets && offsets.length > 0) {
      for (const offset of offsets) {
        isMatch = String(searchNumber) === String(offset);

        if (isMatch) {
          return isMatch;
        }
      }
    }

    return isMatch;
  };
};

const filterFn = offsetFactory(50, 100);
const fibSequence = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

console.log('match: ', fibSequence.filter(filterFn));
// match: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …] (11)
```

`offsetFactory()` has a function declared within, `createOffset()` which creates a local variable *offsets* and a single lexical environment that is shared by the *anonymous inner function*. The inner function defined inside `offsetFactory()` has its own local variables, however, since inner functions have access to variables of outer functions, *offsets* variable declared in the parent function, `offsetFactory()` can be accessed by the *anonymous inner function*.

`createOffset()` accepts two parameters, *number* to offset from and *count* indicating how many numbers to generate. The loop uses the *count* parameter and modulus to generate numbers on both left and right of the *number* provided as a parameter and afterward push the initial *number* provided into the result.

The *anonymous inner function* will be invoked as a callback function to any standard method that accepts function as an argument and the *anonymous inner function* accepts 1 parameter, *searchNumber* for filtering through the local variable *offsets* created by the `createOffset()` function. If there's a match during an iteration of local variable *offsets* the *anonymous inner function* returns true otherwise false.


## Run the code

You'll notice *fibSequence* is filtered by `filterFn()`. Although it works as expected, the performance is not good enough. What happens here is every time `filterFn()` is invoked with a new *searchNumber* from *fibSequence*; closure variable, *offsets* is iterated and compared with *searchNumber* until a match is found.


## Calculate the cost

If given **(i.e. offsets = [1..1000])** and **(i.e. fibSequence = [1..2000])**, iterating through *fibSequence* linearly X times and for each M item, iterate over *offsets* linearly N items *:(, sad!*. Giving, `M * N`.


# Second Iteration

After discovering this problem, my research revealed the high-cost operation can be reduced by yanking 1 item off the local variable, *offsets* for each *fibSequence* number match. The below code gives insight:

```javascript
function offsetFactory(startWithNumber, count) {
  const createOffset = (number, count) => {
    let result = [];
    let head = number;
    let tail = number;

    for (let j = 0; j <= count; j += 1) {
      if (result.length + 1 === count) {
        result.push(number);
        break;
      }

      if (j % 2 === 0 && head >= 0) {
        head += 1;
        result.push(head);
      } else if (j % 2 === 1 && tail > 0) {
        tail -= 1;
        result.push(tail);
      } else {
        head += 1;
        result.push(head);
      }
    }

    return result.sort((a, b) => a - b);
  };

  const offsets = createOffset(Number(startWithNumber), parseInt(count, 10));
  console.log('offsets: ', offsets);
  // offsets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, …] (100)

  return (searchNumber) => {
    let isMatch = false;

    if (offsets && offsets.length > 0) {
      for (const offset of offsets) {
        isMatch = String(searchNumber) === String(offset);

        if (isMatch) {
          const index = offsets.indexOf(id);

          if (index > -1) {
            offsets.splice(index, 1);
          }

          return isMatch;
        }
      }
    }

    return isMatch;
  };
};

const filterFn = offsetFactory(50, 100);
const fibSequence = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

console.log('match: ', fibSequence.filter(filterFn));
// match: [1, 2, 3, 5, 8, 13, 21, 34, 55, …] (11)
```


## Run the code

You might not notice that much change but the code above is more performant compared to the previous code. What happens here is every time `filterFn()` is invoked with a new *searchNumber* from *fibSequence*, each local variable, *offsets* number is iterated and compared with *searchNumber* if both match we keep *searchNumber* and remove the matched number from the local variable, *offsets* Array, repeating the same process for each *searchNumber*.

The only problem with this optimized approach is uniqueness, *fibSequence* declaration above contains number `1` at index 1 and 2 and we expect final output to contain `1` twice, but this is not the case 'cause after matching `1` at index 1, the matched number is removed from local variable, *offsets* and that will prevent `1` at index 2 from getting matched.


## Calculate the cost

If given **(i.e. offsets = [1..1000])** and **(i.e. fibSequence = [1..2000])**, iterating through *fibSequence* linearly X times and for each M item, iterate over *offsets* linearly N times - 1, meaning *offsets* reduces by 1 for each iteration *:), Ah! Much better!*. Giving, `M * (N - 1)`.


# The Lesson

I hope the comparison above gives you insight into writing performant code and increasing program performance whenever possible, :), also note the second iteration above, although, performant expects numbers you're searching through be unique otherwise you'll end up with an incomplete output.

  [Madara with Nine Tails Sketch]: /static/images/2019/madara-with-nine-tails-sketch.jpg "Madara with Nine Tails Sketch"
  [Closures and Lexical scoping]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures "x"
  [Array]: https://xyz.com "x"
