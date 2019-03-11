---
aliases:
  - /sugg-xyz/
date: "2018-10-18"
description: "Thought process behind sugg.xyz, a note project."
slug: "sugg-xyz"
tags: ["programming", "personal development"]
title: "sugg.xyz"
---


![Screen Shot 2018-10-08 13 30 31]


**UPDATE(s):**

- **18 October 2018:** Sugg will be temporarily down due to Firebase Mandatory Upgrade from v2 SDKs.[^1]
- **17 December 2018:** Sugg currently offline for maintainance.
- **5 January 2019:** Sugg Application Logic and Firebase Mandatory Upgrade commences.
- **14 February 2019:** Sugg Application Logic and Firebase Mandatory Upgrade complete.
- **15 February 2019:** Deploy Sugg Application to development server for soak test.[^2]
- **7 March 2019:** Deploy Sugg Application to production server.

[Sugg][] is a colorful simple note application, that allows you to share notes with your friends and families or privately to just that special one :). **Sugg** grew out of curiosity, and desire to draw closer to a slower, simpler way of life while connecting with friends by sharing notes, telling them how I feel about that special moment.

In an era of hectic lifestyles, hi-tech toys, and hi-speed internet, we’ve replaced people and meaningful relationships with work and busyness. I hope my application can help you recapture and reconnect you with what’s important in life; sharing simple, colorful heart warm notes with special ones.


## Why?

**Learn.**

I've found myself questioning features I see on existing products (i.e. Google Documents — sharing, multi-edit and more). The idea behind **Sugg** is simple; create an application that allows taking note, authenticating with social networks, adding colors and sharing with friends privately or publicly. This product was a perfect learning experience for me, not only did I have to think through structuring database for both public and private sharing but also which user information should be tied to sharing since authentication was via a social network, the best was an email address.

It's also a way to learn how sharing works, between registered users and sharing publicly. This application draws inspiration from well-known existing applications like Keep and Google Docs. This product doesn't compete with any and the intention is to serve as a personal note application for myself, family and friends who care about privacy but just want to take and share notes.

**Privacy.**

There's been a ton of news around data privacy and I strongly believe users data should belong to them and companies shouldn't just use data however they like either offering to optimize their business or targeting advertisement. If you're offering a free or paid application make it known to users what you intend to do with their data and users can decide if that's fine by them.

Privacy when doing stuff is essential for me, I want to be able to add a note and know no one else has access to this note and I'm not tracked or getting targeted advertisement.

**Sugg** was built with privacy in mind and that means users can have their account deleted alongside notes they've ever created on the platform, we don't share user data with any third party company and the security rules on data are profound, allowing users fetch only their data. **Sugg** offers API to query users and notes information but this is for developers on the platform that would like to build applications way powerful than **Sugg** current client web application.


## Final Thoughts

As noted on [Why?]({{< relref "#why" >}}) above, **Sugg** solves those problems. Anyhow, if you share the same opinion as do I, give [sugg.xyz][] a try and [mail me][] if you have any questions? Would be happy to help.

  [^1]: Documentation summarizing [Firebase Authentication: Mandatory Upgrade from v2 SDKs][] and [upgrade your Web / Node.js application][].
  [^2]: Soak test involves validating application behavior with a typical production load, over a continuous availability period.

  [Screen Shot 2018-10-08 13 30 31]: /static/images/2018/Screen%20Shot%202018-10-08%2013%2030%2031.png "Screen Shot 2018-10-08 13 30 31"
  [Sugg]: http://www.sugg.xyz/note/d/-LNbXB765JuPKa3C7SMC?uid=google:100527560885026371643&meta_id=-LNbXBElq5zsLHRg9aYQ&shared=false "Sugg — Thought"
  [sugg.xyz]: http://www.sugg.xyz "Sugg"
  [mail me]: mailto:r@akinjide.me "Akinjide Bankole' Email"
  [Firebase Authentication: Mandatory Upgrade from v2 SDKs]: https://docs.google.com/document/d/1vpQV8DBQLkIZci7Vh8N4LUHyTkBOsuW5eXE1x8IAqvw/edit "Firebase Authentication: Mandatory Upgrade from v2 SDKs"
  [upgrade your Web / Node.js application]: https://firebase.google.com/support/guides/firebase-web "upgrade your Web / Node.js application"
  [Soak test]: https://en.wikipedia.org/wiki/Soak_testing "Soak test"
