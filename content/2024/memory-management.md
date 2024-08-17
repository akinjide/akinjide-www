---
aliases:
  - /memory-management/
date: "2024-08-17"
description: "If you're reading this, means I finally published but why bother about memory management in JavaScript?"
slug: "memory-management"
tags:
  - "programming"
  - "personal development"
title: "Memory Management"
draft: true
---


![Shadow on Shadow Sketch][]


https://en.wikipedia.org/wiki/Memory_management

http://crockford.com/javascript/memory/leak.html
Memory leaks occurs when a system does not correctly manage its memory allocations, memory leak is a bug and can include reduced system performance and failure.


Memory
- Life Cycle
- Garbage Collection
  - Reference-Counting Garbage Collection
  - Mark-and-Sweep Algorithm
- Leaks
- Troubleshoot

How hard memory management in Node.js is?

In the Front-End Engineering community, long-standing assumptions about the life of a page are being challenged as full-page refreshes and traditional Ajax patterns are replaced with Ajax Navigation and client-side frameworks like Backbone and SproutCore. While these new technologies enable greater performance and code re-use, the benefits come at a cost – added complexity. With these new patterns, JavaScript memory management becomes an even more critical aspect of the development process. In order to successfully apply these new technologies, Front-End Engineers will need to understand and deliberately manage the individual lifecycles and memory footprints of the components (DOM Elements, JavaScript Objects, client-side cache) that make up their applications.

There are two main contributors to memory issues in JavaScript:

Orphaned JS/DOM objects.
Failed garbage collection in Internet Explorer due to circular references between JS objects.

Every JS Object and DOM element needs an “exit strategy.” For JS objects, this is an explicit nullification (object = null) when the reference is no longer needed.


Circular References

JavaScript Objects and DOM elements that store references to one another cause Internet Explorer’s garbage collector to not reclaim memory, resulting in memory leaks.

Solutions:
Academic Solution: “Use closures sparingly.” This is the takeaway from the MSDN Memory Leaks Page and numerous other articles on the subject. It’s wrong. Closures are an important feature of the language and re-architecting around them results in un-maintainable and disorganized code:


Practical Solution: Embrace circular references when they improve code clarity with the expectation that you’ll explicitly nullify JS objects at the end of their lifecycle.

Call jQuery.remove() on an element and jQuery will explicitly nullify the properties and events for the element, designating the memory for reclamation*.


```
// --------------------------------------------------------
// Excerpt from jQuery's cleanData() (MIT Licence)
// Embrace circular references in event bindings, but clean up.
if ( data && data.events ) {
  for ( var type in data.events ) {
    if ( special[ type ] ) {
      jQuery.event.remove( elem, type );
    } else {
      jQuery.removeEvent( elem, type, data.handle );
    }
  }

  // Null the DOM reference to avoid IE6/7/8 leak (#7054)
  if ( data.handle ) {
    data.handle.elem = null;
  }
}
// *** More cleanup/nullifying of attributes here ***
```

Warning: relying on a library to nullify all references on destroy doesn’t mean you’re home free. We ran into a jQuery bug where event handlers were not being removed correctly and were able to apply a patch. The jQuery Community is very proactive in reporting and patching memory leak issues, but it’s a good lesson to stay diligent.
Speaking of staying diligent; How do you stay on top of memory issues and make sure they don’t crop up again? This is an open question, and one that I’m interested in learning more about from the JS community. One thing is for certain, you will need solid tools.

Detection & Measurement
A good starting point to apply these concepts is to benchmark the amount of memory that is allocated for a set of core components in your application. Once you have a baseline, you will be one step closer to understanding how the footprint changes over time and isolating potentially expensive memory issues during code reviews.

At Socialcast, we used a combination of IEJSLeaksDetector, Sieve, and an activity-generating bookmarklet called Hammer to measure memory usage and the total number of DOM elements under different application loads. Measurements were taken on page load, after individual actions, and during intensive usage (hundreds of messages created from JSON objects) to isolate problem areas.

In our core application, a message can go from being simple (a brief status update) to complex (videos, polls, link previews, or other attachments). Comparing the baseline memory footprint to a message that contained a Flash object revealed an exponential increase in memory usage and prompted projects to break reliance on Flash as a dependency for certain features.

Detection Tools:
IEJSLeaksDetector
Highlight: stack traces for memory leaks.
Sieve
Highlight: memory usage report and live deltas as memory is reclaimed by the Garbage Collector.
Google Chrome Memory Heap Profiler
Highlight: Integrated within Chrome (OS platform-agnostic) and interactive stack traces.
After using Sieve and IEJSLeaksDetector without any good alternatives, I’m very excited about Chrome’s new Memory Heap Profiler. Google’s move to add this as a core developer tool reinforces that memory management in JavaScript will be a crucial focal point for Front-End Engineers in the coming years.

*Notes on garbage collectors:
Browser garbage collectors do not run immediately after elements are removed or references are nullified. There are many articles that claim to have found ways to trigger them, but none worked definitively in my testing. The key concept to understand is that removing/nullifying objects *designates* the memory for reclamation, and it’s up to the browser to determine when that occurs.




Memory Management and garbage collection in JavaScript is a slightly unfamiliar topic since in JavaScript we are not performing any memory operations explicitly, however, it is good to know how it works.

In the low-level languages like C, developers need to manually allocate and deallocate the memory using the malloc(), calloc(), realloc(), and free() methods. In the high-level languages like Java and JavaScript, we don't need to explicitly allocate or release memory. JavaScript values are allocated when things are created (objects, Strings, etc.) and freed automatically when they are no longer used. This process is called Garbage collection.

A JS implementation (or more generally, any implementation of a language where manual memory management is taken out of the programmers' hands) without GC seems pretty worthless to me. And in fact, Google showed me code.google.com/apis/v8/design.html#garb_coll as the very first result.




active garbage collection with:

node --expose-gc test.js
and use with:

global.gc();
Happy Coding :)

Manually calling the garbage collector will not help with a real memory leak. The garbage collector is called periodically by the runtime anyway and a memory leak in a GCed language is caused by creating references that the garbage collector cannot safely collect. However when debugging, calling the gc frequently can greatly increase the signal to noise ratio and make it much easier to tell if you have a real memory leak.





V8 has a powerful and intelligent garbage collector in build.

Your main problem is not understanding how closures maintain a reference to scope and context of outer functions. This means there are various ways you can create circular references or otherwise create variables that just do not get cleaned up.

This is because your code is ambigious and the compiler can not tell if it is safe to garbage collect it.

A way to force the GC to pick up data is to null your variables.

function(foo, cb) {
    var bigObject = new BigObject();
    doFoo(foo).on("change", function(e) {
         if (e.type === bigObject.type) {
              cb();
              // bigObject = null;
         }
    });
}
How does v8 know whether it is safe to garbage collect big object when it's in an event handler? It doesn't so you need to tell it it's no longer used by setting the variable to null.


Computer Programming, resource management refers to techniques for managing resources (components with limited availability).

Computer programs may manage their own resources[which?] by using features exposed by programming languages (Elder, Jackson & Liblit (2008) is a survey article contrasting different approaches), or may elect to manage them by a host – an operating system or virtual machine – or another program.

Host-based management is known as resource tracking, and consists of cleaning up resource leaks: terminating access to resources that have been acquired but not released after use. This is known as reclaiming resources, and is analogous to garbage collection for memory. On many systems the operating system reclaims resources after the process makes the exit system call.

var objA = {
    prop: "foo",
    next: null
};

var objB = {
    prop: "foo",
    prev: null
};

objA.next = objB;
objB.prev = objA;


To understand memory leaks it’s important to understand how memory management and garbage collection works in Node.js. A running process is provided with memory to store data most likely a state. The object in memory can carry references to other objects, string, array or a number. The software should keep the object in memory only if it’s accessible by another object which being referenced by the root object. Garbage collection detects and reclaims inaccessible memory objects, in order to free up memory. The garbage collector has two main tasks; trace and count reference from other objects. It can get tricky when you need to track remote references from another process, but in the Node.js world we use a single process which makes our life easier.

Here are 10 steps to debug memory leaks when using Node.js:
Try running your app using a different node version (try newer one);
Make sure your functions are “pure”;
Check for variable references;
Check your node modules, the lesser the better;
use memwatch-next is a great package, and checkout this gist;
Ask people around you if you are working in an office
Take at least 3 heapdump and compare them, I would recommend watching this video by Google
Run your app on debug mode and take heapdump profiler
This might be one of the most tedious steps, but try taking heap snapshot after every action on your app and compare them;
Divide and conquer approach, create a new git branch and try to remove pieces of your code until you know you’re isolated the problem;

V8: Open source JavaScript Engine
Node: JavaScript runtime built on V8

RSS: Total process memory according to the operating system, or resident set size
Heap Total: The amount of memory sequestered by V8 for use as its internal
heap.
Heap Used: The amount of the internal heap that is actually being used by V8.
Native: The amount of the total process memory that is not in V8, this includes Node runtime specific memory (e.g. Node’s buffers and internal objects) and native modules.


The latter process is called garbage collection. This “automatically” is a source of confusion and gives JavaScript (and high-level languages) developers the impression they can decide not to care about memory management. This is a mistake.


## Memory

When declaring a variable, JavaScript will automatically allocate the memory for the variables.

```
var numberVar = 100;                // allocates memory for a number
var stringVar = 'node simplified';  // allocates memory for a string
var objectVar = {a: 1};             // allocates memory for an object
var a = [1, null, 'abra'];          // allocates memory for the array
function f(a) {
  return a + 2;
} // allocates memory for a function
```
When the memory is no longer needed anymore, then the allocated memory will be released. Memory leaks, and most memory related issues, occur while releasing memory. The hardest part is finding the memory which is no longer needed and tracking it down with the garbage collector.


### Life Cycle

### Leaks

Irrespective of any language (high-level or low-level), memory life cycle will be similar to what is shown below.

`Allocate Memory` `Use Memory` `Release Memory`

In the high-level languages, we will just read and write to the memory explicitly (Use Memory). In the low-level languages, developers need to take care to explicitly perform all three steps.

Since allocation and deallocation happen automatically, that doesn't mean developers don't care about memory management. Poor coding may lead to memory leaks, which is a condition where memory is not released even though it is no longer used by the application. So it is very important to learn more about memory management.


## Garbage Collection

What is JavaScript garbage collection? What's important for a web programmer to understand about JavaScript garbage collection, in order to write better code?

garbage collection (GC) is a form of automatic memory management by removing the objects that no needed anymore.

any process deal with memory follow these steps:

1 - allocate your memory space you need

2 - do some processing

3 - free this memory space

there are two main algorithm used to detect which objects no needed anymore.

Reference-counting garbage collection: this algorithm reduces the definition of "an object is not needed anymore" to "an object has no other object referencing to it", the object will removed if no reference point to it

Mark-and-sweep algorithm: connect each objects to root source. any object doesn't connect to root or other object. this object will be removed.

currently most modern browsers using the second algorithm.



To the best of my knowledge, JavaScript's objects are garbage collected periodically when there are no references remaining to the object. It is something that happens automatically, but if you want to see more about how it works, at the C++ level, it makes sense to take a look at the WebKit or V8 source code

Typically you don't need to think about it, however, in older browsers, like IE 5.5 and early versions of IE 6, and perhaps current versions, closures would create circular references that when unchecked would end up eating up memory. In the particular case that I mean about closures, it was when you added a JavaScript reference to a dom object, and an object to a DOM object that referred back to the JavaScript object. Basically it could never be collected, and would eventually cause the OS to become unstable in test apps that looped to create crashes. In practice these leaks are usually small, but to keep your code clean you should delete the JavaScript reference to the DOM object.

Usually it is a good idea to use the delete keyword to immediately de-reference big objects like JSON data that you have received back and done whatever you need to do with it, especially in mobile web development. This causes the next sweep of the GC to remove that object and free its memory.



"In computer science, garbage collection (GC) is a form of automatic memory management. The garbage collector, or just collector, attempts to reclaim garbage, or memory used by objects that will never be accessed or mutated again by the application."
All JavaScript engines have their own garbage collectors, and they may differ. Most time you do not have to deal with them because they just do what they supposed to do.

Writing better code mostly depends of how good do you know programming principles, language and particular implementation.


What is JavaScript garbage collection?
check this

What's important for a web programmer to understand about JavaScript garbage collection, in order to write better code?
In Javascript you don't care about memory allocation and deallocation. The whole problem is demanded to the Javascript interpreter. Leaks are still possible in Javascript, but they are bugs of the interpreter. If you are interested in this topic you could read more in www.memorymanagement.org


Memory leaks are a beast in JavaScript. If you're writing a simple "college project" application, then no worries. But when you start writing high-performance enterprise-level apps, memory management in JavaScript is a must.


Garbage collection is the process of finding memory which is no longer used by the application and releasing it. To find the memory which is no longer used, a few algorithms will be used by the garbage collector, and in this section, we will look into the main garbage collection algorithms and their limitations. We will look into following algorithms:

- Reference-counting garbage collection.
- Mark-and-sweep algorithm.

### Reference-Counting Garbage Collection

This is the most important garbage collection algorithm. If in reference counting algorithms, there are no references to an object, it will be automatically garbage collected. This algorithm considers zero referencing object as an object that is no longer used by the application.

````
Example:
var o = { a: { b: 2 } };
// 2 objects created. One is referenced by the other as one of its properties.
// Obviously, none can be garbage-collected
o = 1;     // what was the 'a' property of the object originally in o
           // has zero references to it. It can be garbage collected.
Limitation: Cycles
function func() {
  var o = {};
  var o2 = {};
  o.a = o2; // o references o2
  o2.a = o; // o2 references o
  return 'true';
}
func();
````
Consider the above code snippet in which o is referenced to o2 and o2 is referenced to o and it creates a cycle. When the scope goes out of the method, then these two objects are useless. However, the garbage collector is unable to free the memory since those two still got the reference to each other. It leads to memory leaks in the application.

### Mark-and-Sweep Algorithm

The garbage collector uses this algorithm to free memory when an object is unreachable, rather than a zero referencing object.

The garbage collector will first find all the global objects or root objects and will find all the references to these global objects and references to the reference object, and so on. Using this algorithm, the garbage collector will identify the reachable and unreachable objects. All the unreachable objects will be automatically garbage collected.

Most importantly debug your code to remove memory leaks. Use these package to find them in your code:

nodetime
node-inspector
memwatch-next
heapdump

## Troubleshoot

  [Shadow on Shadow Sketch]: /static/images/2021/shadow-on-shadow-sketch.jpg "Shadow on Shadow Sketch"
