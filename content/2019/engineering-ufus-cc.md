---
aliases:
  - /engineering-ufus-cc/
date: "2019-03-11"
description: "Thought process behind ufus.cc, a URL shortener."
slug: "engineering-ufus-cc"
tags:
  - "programming"
  - "personal development"
title: "Engineering ufus.cc"
---


![Grim Reaper Sketch][]


I completed development of [ufus.cc][] last year and its currently moderately in use. I figured I should take out some time and share technical information and roadblocks I encountered building [ufus][], a URL shortener.[^1]

## Technology Stack


![Ufus Tech Stack Logos]


I chose this technology stack especially Redis because I wanted to understand the concept of in-memory database and its advantages. On the client side, jQuery was the obvious choice since the server renders the presentation layer, I wanted something light and efficient for browser DOM manipulation[^2]. Node.js serves the static content and presentation layer while connecting to Redis to retrieve information. In my opinion, this increases response time and saves overhead if the Redis database is hosted on the same server, but in my case, I'm using [Heroku Redis][].


**Redis**

[Redis][] is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries and streams.

Heroku Redis is a reliable and powerful Redis as a service with a starting cost at $0/mo. It offers easy optimization, a dashboard to get quick insights and vertical scaling by choosing from a wide range of plans based on the amount of memory and connections, essential scaling up is super easy.

**jQuery**

[jQuery][] is a JavaScript library designed to simplify HTML DOM tree traversal and manipulation, as well as event handling, CSS animation, Ajax and Cross-browser compatibility. It's free, open-source software and analysis indicate that it's the most widely deployed JavaScript library by a large margin.

**Node.js**

As Node.js is designed for building scalable network applications and is asynchronously event-driven, I decided it's the best for server-side and my familiarity with JavaScript allowed building robust features and deploying with ease. **Ufus** uses Node.js for secure API, serving static content and the Web Application through [Express.js][] framework.

**Ufus** implements [vhost][] which hands off incoming traffic to a matched-registered host. I did this because the root domain renders the server side template and needs to support public API. Hence, `api.ufus.cc` was registered as a vhost and the request will just be routed to the matching handler.


![Ufus Architecture Diagram][]


**Papertrail**

[Papertrail][] is a log management system and makes logging fun. Allowing diagnosing app errors, monitoring alerts, quick visualization of log throughput for new or saved searches, reducing the time to troubleshoot errors. **Ufus** uses [Papertrail as a Heroku add-on][] and drains Heroku logs to the Papertrail service, this helps with visualizing logs clearly, searching easily and debugging errors after deployments.

**Sentry**

[Sentry][], an error tracker that helps developers monitor and fix crashes in real time, it started as, and remains an open-source project and is now delivered as a hosted service. It helps with resolving and reproducing errors with max efficiency and visibility.

Starting at $0/mo, **Ufus** uses [Sentry as a Heroku add-on][] to get client-side errors notifications in the production app immediately, this helps build better and iterate faster.


### Application Engineering

I'll represent **Ufus** application structure using a plain tree structure, which uses [Express.js][], [EJS][], [Redis][], [ZURB Foundation][], and [jQuery][]. I'll just be explaining the core but you can view [ufus][] on GitHub for better understanding.

```text
ufus
  ├── LICENSE
  ├── config
  │   ├── env.js
  │   └── express.js
  ├── index.js
  ├── lib
  │   ├── conf.js
  │   └── redis.js
  ├── package.json
  ├── public
  │   ├── favicon.ico
  │   ├── images
  │   │   └── svg
  │   │       └── hexagon-background.svg
  │   ├── scripts
  │   │   ├── jquery.ba-throttle-debounce.min.js
  │   │   └── main.js
  │   └── styles
  │       └── main.css
  ├── routes
  │   ├── api.js
  │   └── index.js
  ├── test
  │   ├── app.js
  │   └── redis_conf.js
  └── views
      ├── error.ejs
      └── index.ejs
```

- `config` application wide configuration files
  - `env.js` port, URL and Redis configurations.
  - `express.js` middleware used for every API routes defined.
- `index.js` global middleware, request headers, logger and error-handlers.
- `lib` core files
  - `conf.js` validate and ping URLs, configure Redis model and persist layer.
  - `redis.js` application Redis methods: set, get, hash, clicks, and counter.
- `package.json` dependencies, scripts and project information.
- `public` images, scripts and styles for the client application.
- `routes` application wide routes files
  - `api.js` public API Application routes.
  - `index.js` 404, error-handler and Web Application routes.
- `test` application test cases.
- `views`
  - `error.ejs` client application error page.
  - `index.ejs` client application landing page.


### In Memory Engineering

```yaml
redis:
  ufus:counter
    - 600
  ufus:url:074cdaade5ef:
    - 8c4oJ
  ufus:hash:8c4oJ:
    - url
    - https://stackoverflow.com/questions/35921503/looping-through-a-nodelist-js
    - clicks
    - 0
    - hash
    - 8c4oJ
```

- `ufus:counter` stores an integer count value (i.e. `<300>`) of a base58 unique hash.
- `ufus:url:074cdaade5ef` stores a base58 unique hash value (i.e. `8c4oJ`) and the key suffix `074cdaade5ef` is an md5 representation of the long URL requested to be shortened.
- `ufus:hash:8c4oJ` stores long URL metadata and the key suffix `8c4oJ` is a base58 unique hash, generated encoding **random integer + ufus:counter** current value (i.e. `base58.encode(999 + 300)`).
  - `clicks` stores an integer count value (i.e. `<10>`) of times URL was visited.
  - `url` stores the original URL requested to be shortened.
  - `hash` stores a base58 unique hash generated.


### Deploy

![Heroku Logo]


[Heroku][] is a Platform-as-a-Service (PaaS) where the developer is freed up from managing the underlying server infrastructure and can concentrate on the functionality of the application. This guided my decision to use Heroku for hosting **Ufus**, plus Heroku offers reasonable pricing which is awesome and it currently serves its API and Web application using 1 Web/1 Worker with 512MB RAM and is capable of handling quite a bit of concurrent traffic, ~1 000 requests per second.


## Drawbacks

#### Custom Hash

Custom hash allows providing own short hash to use when generating a shortened URL, this feature is currently not implemented due to server scale and constraints validating user input. This is possible and not trivial to implement, I just don't think it's a shortened URL when you provide a custom hash.

Another possible drawback with custom hashing is lookup since each hash should be unique, looking up a custom hash would take quite some time since **Ufus** currently doesn't TTL[^3] shortened URLs.

#### Account

**Ufus** currently does not support user authentication or account management, this implies that **Ufus** URL shortening service can be accessed anonymously and does not gather any personal data except the URL you're shortening. Next release is a TTL[^3] URL, basically, you specify how long you want to keep the shortened URL active.

#### Uptime

**Ufus** runs on Heroku and is hibernated when the server is not in use to save resources, due to its free plan. This can be a bottleneck for every first request due to server initializing and slow response time. A solution to this would be constantly pinging the server but that's a dirty hack I'm not ready to implement. Maybe later when it gets heavy traffic.


## Final Thoughts

My hope is that my writing here convinces you to take a look at **Ufus**'s architecture and consider it as a reference. Anyhow, if you share the same opinion as do I, give [ufus.cc][] a try and [mail me][] if you have any questions? Would be happy to help.

**NOTE: I’m not in any way affiliated with any services mentioned, these thoughts are completely my own.**

  [^1]: From Wikipedia explaining techniques, advantages and shortcomings of [URL shortening][].
  [^2]: A two-tier is a software architecture in which a presentation layer or interface runs on a client, and a data layer gets stored on a server.
  [^3]: [Time to live][] (TTL) is a mechanism that limits data lifespan in a computer, implemented as a counter or timestamp attached to the data.

  [Grim Reaper Sketch]: /static/images/2019/grim-reaper-sketch.png "Grim Reaper Sketch"
  [ufus.cc]: http://www.ufus.cc "Ufus — Website"
  [ufus]: https://github.com/akinjide/ufus "Ufus — Github"
  [Ufus Tech Stack Logos]: /static/images/2019/ufus-tech-stack-logos.png "Ufus Tech Stack Logos"
  [Heroku Redis]: https://www.heroku.com/redis "Heroku Redis"
  [vhost]: https://github.com/expressjs/vhost "expressjs/vhost: virtual domain hosting"
  [Ufus Architecture Diagram]: /static/images/2019/ufus-architecture-diagram.png "Ufus Architecture Diagram"
  [Papertrail]: https://papertrailapp.com "Papertrail - cloud-hosted log management, live in seconds"
  [Papertrail as a Heroku add-on]: https://elements.heroku.com/addons/papertrail "Papertrail - Add-ons - Heroku Elements"
  [Sentry]: https://sentry.io "Sentry | Error Tracking Software — JavaScript, Python, PHP, Ruby, more"
  [Sentry as a Heroku add-on]: https://elements.heroku.com/addons/sentry "Sentry - Add-ons - Heroku Elements"
  [yaml]: http://yaml.org "The official YAML Web Site"
  [Express.js]: http://expressjs.com "Express — Node.js web application framework"
  [EJS]: https://www.ejs.co "EJS — Embedded JavaScript templating."
  [Redis]: https://redis.io "Redis"
  [ZURB Foundation]: https://foundation.zurb.com "The most advanced responsive front-end framework in the world."
  [jQuery]: https://jquery.com "jQuery"
  [Heroku Logo]: /static/images/2018/heroku-logo.jpg "Heroku Logo"
  [Heroku]: https://www.heroku.com "Heroku"
  [mail me]: mailto:r@akinjide.me "Akinjide Bankole' Email"
  [URL shortening]: https://en.wikipedia.org/wiki/URL_shortening "URL shortening - Wikipedia"
  [Time to live]: https://en.wikipedia.org/wiki/Time_to_live "Time to live - Wikipedia"
