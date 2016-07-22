---
aliases:
  - /combining-arrays-in-javascript/
date: "2016-05-28"
description: "Today I'd like to share a personal story with you about my frustrating experience trying different methods of combining or merging two Javascript Arrays along with the pros and cons of each approach."
slug: "combining-arrays-in-javascript"
tags:
  - "programming"
title: Combining Arrays in Javascript
---


![Avengers vs Justice League Sketch][]


As of late, I’ve been spending a fair amount of time learning new Javascript techniques. 
I find myself discovering some parts of the language that I am liking quite a lot.

Today I’d like to share a personal story with you about my frustrating experience trying 
different methods of combining or merging two Javascript Arrays along with the pros and cons of each approach.


## The Story

Here’s how it started: three days ago I was studying some Array methods. My idea 
was simple: I wanted a simple concatenation of two Arrays so that I could later use it for some simple Graph data.

Let’s start with this scenario:

```javascript
var numeric = [1, 2, 3, 4, 5, 6, 7, 8];
var alpha = ['foo', 'bar', 'baz', 'bar', 'bar', 'baz'];
```

The concatenation of **numeric** and **alpha** would obviously be:

```javascript
[
  1, 2, 3, 4, 5, 6, 7, 8, 'foo', 'bar', 'baz', 'bar', 'bar', 'baz'
];
```

After taking a look at this, I realized that the simplest way to concatenate 
would be to just use **Array.prototype.concat()** method to merge the two Arrays into one sequentially.

So, I sat down and wrote a first version that looked something like this:

```javascript
var new_array = numeric.concat(alpha);
```

This is some pretty basic stuff:

- **numeric** and **alpha** are defined? CHECK!
- **new_array**, a whole new Array representing the combination of **numeric** and **alpha**? CHECK!

But to my dismay, after running for a few minutes I noticed that this small program will eat all the RAM on my laptop! 
if the values above were centupled?!

No problem!, i’ll just unset so **numeric** and **alpha** are garbaged collected, right? Problem Solved!

```javascript
numeric = alpha = null;
```

Meh, I realized that for only a couple of small Arrays, this would be fine. 
But I figured that when working with large Arrays and repeating this process a lot, or 
working in a memory-limited environment, this method leaves a lot to be desired.

So, being confused about what to do, I decided to dig a bit deeper. I narrowed my idea 
down to looped insertion. Ok, let’s just append one Array content onto the other, using **Array.prototype.push()** method:

```javascript
for (var i = 0; i < alpha.length; i++) {
  numeric.push(alpha[i]);
}
```

Now, **numeric** has the result of both the original **numeric** plus the contents of **alpha**. Better for memory, it would seem.

But what if **numeric** was minuscule and **alpha** was comparatively colossal? For both 
memory and speed reasons, you’d probably want to push the smaller **numeric** onto the front of **alpha** 
rather than the colossal **alpha** onto the end **numeric**. No problem, i’ll just replace **Array.prototype.push()** 
with **Array.prototype.unshift()** method and loop in the opposite direction:

```javascript
for (var i = numeric.length - 1; i >= 0; i--) {
  alpha.push(numeric[i]);
}
```

Unfortunately, this still isn’t very efficient – loops are ugly and harder to maintain. Can we do any better?

So then I tried the following:

```javascript
numeric = alpha.reduce(function(prev, curr) {
  prev.push(curr);
  return prev;
}, numeric);
```

```javascript
alpha = numeric.reduceRight(function(prev, curr) {
  prev.unshift(curr);
  return prev;
}, alpha);
```

**Array.prototype.reduce()** and **Array.prototype.reduceRight()** are nice. However, the 
first major problem is that we’re effectively doubling the size (temporarily, of course!) of the 
thing being appended by essentially copying its contents to the stack for the function call. Moreover, 
different Javascript engines have different implementation–dependent limitations to the number of arguments that can be passed.

So, if the added Array had a million items in it, you’d almost certainly exceed the size of the stack 
allowed for that push() or unshift() call. Ugh. It’ll work just fine for a few thousand elements, but 
you have to be careful not to exceed a reasonably safe limit.


## The Moral


![Bird Sketch][]


Performing Array merge in Javascript turned out to be quite a lot harder than I expected. **Array.prototype.concat()** seems to 
be the tried and true approach for combining two (or more!) Arrays. But the hidden danger is that it’s creating a 
new Array instead of modifying one of the existing ones.

Giving the various reasons, perhaps the best of all of the options (including others not shown) is the **Array.prototype.reduce()** 
and **Array.prototype.reduceRight()**. Whatever you choose, it’s probably a good idea to think critically 
about your Array merging strategy rather than taking it for granted.


  [Avengers vs Justice League Sketch]: /static/images/2016/avengers-vs-justice-league-sketch.jpg "Avengers vs Justice League Sketch"
  [Bird Sketch]: /static/images/2016/bird-sketch.jpg "Bird Sketch"
