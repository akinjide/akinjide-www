---
aliases:
  - /engineering-sugg-xyz/
date: "2018-11-08"
description: "Thought process behind sugg.xyz, a note project."
slug: "engineering-sugg-xyz"
tags: ["programming", "personal development"]
title: "Engineering sugg.xyz"
---


![Owl Sketch]


I've been building **Sugg** for quite a while now, and have seen some imaginable problem and roadblock, I figured it’d be nice to share some interesting technical information: [sugg.xyz][].


## Technology Stack


![Sugg Tech Stack Logos]


Choosing a technology stack was quite hard than I thought, but eventually, I settled for FAN Stack ([Firebase][] because it offers Realtime Database and Authentication, [Angular.js][] and [Node.js][]).

**Firebase Realtime Database**

Firebase Realtime Database is a cloud-hosted, NoSQL database that stores and sync data between users and devices in real-time. It integrates with Firebase Authentication and provides declarative security model allowing access based on user identity or pattern matching with stored data.

In my opinion, Firebase declarative security model is fascinating, especially since anyone can have access to your database credentials but with security rules, only an authenticated user can read and write and at best they'll be affecting only their own data and not the entire database.

Although Firebase supports local cache on devices to serve and store changes when users go offline and synchronize when devices come online, **Sugg** doesn't implement this feature yet.

**Firebase Authentication**

Firebase provides authentication with social network like Facebook, Twitter, Google, etc. and makes managing users simple and secure. Using this method of authentication made me focus on providing seamless sign-in and UI for users and Firebase handles complex cases.

**Angular.js**

Angular.js was initially released October 2010 which makes it among the very first Single Page Application framework, I decided to use Angular.js since it's maintained by Google, provided extensive documentation, community support, and as of **Sugg** initial release Angular.js powered some Google projects. Plus I'm was super familiar with how it works and was just the obvious choice.

Although, Google has released several version of Angular 2, 4, 6 as it's successor and the major changes:

- "scope" or controllers to components as its primary architecture.
- syntax expression, "[ ]" for property binding, and "( )" for event binding.
- Microsoft TypeScript language.
- Modularity, moving core functionality to modules — it's about time.
- Asynchronous template compilation
- Dynamic loading

**Sugg** will be rebuilt later in the future with any other version of Angular or frameworks like [React.js][] or [Vue.js][].

**Node.js**

Node.js is a JavaScript runtime built on Chrome V8 JavaScript engine and enables writing JavaScript on server-side. **Sugg** uses Node.js for secure API, serving static content and Web Application through [Express.js][] framework.

As Node.js is designed for building scalable network applications and is asynchronous event-driven, I decided it's the best for server-side and my familiarity with JavaScript allowed building robust features and deploying with ease.


![Sugg Architecture Diagram][]


### Application Engineering

I'll be using [yaml][] to represent **Sugg** application structure, which uses [Gulp][], [Jade][], [Sass][], and [Angular.js][]. I'll be explaining just the core but you can view the project [on GitHub][] for better understanding.

```yaml
sugg:
  - bin:
    - auth.js
    - www
  - client:
    - public
    - src:
      - app:
        - controllers:
          - *.controller.js
        - directives:
          - *.directive.js
        - filters:
          - *.filter.js
        - partials:
          - *.partial.jade
        - services:
          - *.service.js
        - application.js
        - config.js
      - scripts:
        - **/*.js
        - *.js
      - shared:
        - *.jade
      - styles:
        - **/*.sass
        - *.sass
      - 404.jade
      - index.jade
  - config:
    - config.js
    - middleware.js
    - routes.js
  - worker:
    - *.js
  - index.js
  - gulpfile.js
  - package.json
  - yarn.lock
  - .travis.yml
```

- `bin` core files
  - `auth.js` for generating API Firebase access token, verifying and authenticating with Firebase server.
  - `www` initializes and starts the Node.js server.
- `config` application wide configuration files
  - `middleware.js` middleware used for every API routes defined.
  - `routes.js` API, static and Web Application routes.
  - `config.js` test, development and production environment variables configurations.
- `index.js` global middleware, request headers, logger and error-handlers.
- `gulpfile.js` configures tasks for deploying, copying, bundling and watching.
- `.travis.yml` configures CI/CD to Heroku.
- `package.json` dependencies, scripts and project information.
- `yarn.lock` well, it locks dependencies. :)
- `client`
  - `src` styles, root index and 404, Angular.js controllers, directives, services, filters, and config.
  - `src/app/application.js` requires dependencies, configure client routes and state.
  - `public` gulp generated directory with bundled files and linked dependencies.
- `worker` scheduled scripts that perform actions like removing deleted account.


### Database Engineering

I'll be using [yaml][] to represent **Sugg** current database structure:

```yaml
root:
  notes:
    note_id:
      content: "<div><!--block-->hi there</div>"
      lang: "html"
      settings:
        color: "lavender"
        is_public: false  # if `is_public` is true, anyone with link can view
        share_with: # if `share_with` is defined, only specific people can view, userA and userB
          user_id:
            read: true
            share_id: "-LN5jJzDwEbATlGWjGXc"
            share_at: 1537711363113
            write: true
  users:
    user_id:
      access_token: "Gl0hBu_NOz3b7Wy-wHB8o6K51LVkjyF"
      created: 1490962741849
      suspended: 1522574098167
      email: "r@akinjide.me"
      id: "18474522088343517"
      image_url: "https://www.akinjide.me/static/images/akinjide-avatar.png"
      is_active: true
      is_new: false
      metadata:
        metadata_id:
          created: 1537447335290
          is_public: false  # if `is_public` is true, anyone with link can view
          note_id: "-LMr-8DcC7szafF9aH7T"
          share_with: # if `share_with` is defined, only specific people can view, userA
            user_id:
              read: true
              share_id: "-LN5jJzDwEbATlGWjGXc"
              share_at: 1537711363114
              write: true
          title: "Sugg"
          updated: 1537711783943
      share_with_me:  # if `share_with_me` is defined, only specific people can view, userB
        share_id:
          metadata_id: "-LMqmY5WGsM2jxwcLq4v"
          note_id: "-LMqmY1WMu76rBjjV-X8"
          read: true
          shared_at: 1537711362781
          shared_by: "google:447335290"
          write: true
      name: "Akinjide Bankole"
      provider: "google"
      updated: 1537682964670

  tags:
    tag_id:
      created: 1525895724452
      title: "Personal"
      updated: 1525895724452

  settings:
    user_id:
      created: 1525884100175
      default_layout: "list"
      default_note_color: "pink"
      updated: 1537528578663
```

**Sugg** has four main nodes **users**, **notes**, **tags**, and **settings**. I'll describe and explain the decisions behind each node.

- `root` every node supported by *Sugg* and is an entry to the database.
- `users` authenticated users and note sharing information.
- `notes` authenticated users notes and note sharing information.
- `settings` authenticated users and default settings for personalization.
- `tags` allows authenticated users group notes by tagging each note created, thereby enabling sorting and filtering (i.e. Filter notes by *Travel* tag, every note with Travel tag will be fetched and displayed). Although tags aren’t currently in use.
- `id, user_id, tag_id, metadata_id, note_id, share_id` unique identifiers that enable querying and persisting individual records in the database.
  - `user_id and id` are extracted from a successful social network authentication response.
  - `*_id` are generated by Firebase on persisting to the database.
- `created, suspended, updated, shared_at, share_at` timestamps representing when persisted to the database.
- `read, write, is_public` set permissions for shared note.
- `shared_by` authenticated user identifier of note owner.
- `access_token, email, image_url, name, provider` are extracted from a successful social network authentication response.
- `is_active` enabled when a user deactivates *Sugg*.
- `is_new` enabled for the newly registered user, switched to false on second sign-in.
- `default_layout, default_note_color` set by *Sugg* for the newly registered user, but changes based on user personalization.
- `title, color, lang, content` defines each note created, all attributes are store within node `notes` except `title`.

**Sugg** database structure will ever evolve but the structure above serves the current purpose. I've personally identified minor flaws with the current database structure but this structure will scale without problems.


### Deploy

![Heroku Logo]


[Heroku][] is a Platform-as-a-Service (PaaS) where the developer is freed up from managing the underlying server infrastructure and concentrate on the functionality of the application. This guided my decision to use Heroku for hosting **Sugg**, plus Heroku offers reasonable pricing which is awesome and it currently serves its API and Web application using 1 Web/1 Worker with 512MB RAM and is capable of handling quite a bit of concurrent traffic, ~1 000 requests per second.

**Sugg** uses [Heroku Pipeline][] for deploying to Heroku which is essentially a group of Heroku applications that share the same codebase. Each application in a pipeline will represent one of the development and production stages, this is extremely useful and allows me to manually trigger push to the production stage.

```yaml
# GitHub (Master)
  # └─> Travis (continuous integration/continuous deployment (CI/CD))
    # └─> Heroku Pipeline //> (Development (dev.sugg.xyz)) //> (Production (sugg.xyz))
```


## Difficulties


#### Sharing

Users can share notes either privately using an email address which sets:

- `share_with` node on the sender *notes > settings node* and *users > metadata node*,
- `share_with_me` node on the receiver *users node*,

or publicly which sets:

- `is_public` flag on *notes > settings node*,
- `is_public` flag on *users > metadata node*,

**Sugg** generates [URL][] which follows the pattern `/note/d/:note_id?uid&meta_id&shared`:

- `note_id` note unique identifier as path param (i.e. `/note/d/-y6jE5CK2EnCz08`)
- `uid` user unique identifier as query param (i.e. `?uid=1027560885026371643`)
- `meta_id` user metadata unique identifier as query param (i.e. `&meta_id=LjUTEuluKqn_xMrA`)
- `shared` boolean value indicating public or private (i.e. `&shared=false`)


#### Coloring

Coloring notes was quite straightforward, **Sugg** has a defined color list registered as CSS [class selector][]. When a user picks a color, the color title is saved on the *notes > settings node* and the note renders using the color title as CSS class.


#### Searching

**Sugg** allows searching notes on Web Desktop, using Angular [$rootScope.$broadcast][] and [filtering][] on rendered notes. I settled with this because other search implementation didn't scale.


#### Account Deletion

A user can perform [CRUD][] operations but the major difficulty was deleting user account alongside all records. When an account is deleted **Sugg** sets:

- `suspended` field with current timestamp as value,
- `is_active` to false preventing users from login.

A worker runs monthly to fetch and delete accounts flagged as inactive alongside records attached. Notes shared publicly or privately are deleted as well to uphold data integrity.


#### Lock

**NOTE: Current thought, process stated below might change.**

Currently in progress but the idea is to prevent preying eyes from reading notes when logged in. User can enable lock on note which will require a unique pin.

**Encrypt**

Encrypting a note will use combination:

- **sugg** private key.
- user unique identifier.
- generated unique identifier.
- user unique pin.

**Sugg** will persist the encrypted note with a flag `is_lock` or `is_secure` alongside the *generated unique identifier*.

**Decrypt**

Decrypting a note will use the same process as encrypting but reversed. **Sugg** will not persist the decrypted note unless the user disables lock which resets `is_lock` or `is_secure` flag and deletes the generated unique identifier. The generated unique identifier can't be fetched by anyone, just the note owner.


## Final Thoughts

My hope is that my writing here convinces you to take a look at **Sugg** architecture the next time you build an application and consider following its steps or even better as reference. Anyhow, if you share the same opinion as do I, give [sugg.xyz][] a try and [mail me][] if you have any questions? Would be happy to help.

**NOTE: I’m not in any way affiliated with any services mentioned, these thoughts are completely my own.**

  [Owl Sketch]: /static/images/2018/owl-sketch.jpg "Owl Sketch"
  [sugg.xyz]: http://www.sugg.xyz "Sugg"
  [Sugg Tech Stack Logos]: /static/images/2018/sugg-tech-stack-logos.jpg "Sugg Tech Stack Logos"
  [Firebase]: https://firebase.google.com "Firebase"
  [Angular.js]: https://angularjs.org "AngularJS — Superheroic JavaScript MVW Framework"
  [Node.js]: https://nodejs.org/en/ "Node.js"
  [React.js]: https://reactjs.org "React — A JavaScript library for building user interfaces"
  [Vue.js]: https://vuejs.org "Vue.js"
  [Express.js]: http://expressjs.com "Express - Node.js web application framework"
  [Sugg Architecture Diagram]: /static/images/2018/sugg-architecture-diagram.png "Sugg Architecture Diagram"
  [yaml]: http://yaml.org "The official YAML Web Site"
  [on GitHub]: https://github.com/akinjide/sugg "Sugg — Github"
  [Gulp]: https://gulpjs.com "Gulp"
  [Jade]: http://pugjs.org "Pug"
  [Sass]: https://sass-lang.com "Sass: Syntactically Awesome Style Sheets"
  [Heroku Logo]: /static/images/2018/heroku-logo.jpg "Heroku Logo"
  [Heroku]: https://www.heroku.com "Heroku"
  [Heroku Pipeline]: https://devcenter.heroku.com/articles/pipelines "Pipelines | Heroku Dev Center"
  [URL]: https://en.wikipedia.org/wiki/URL "URL - Wikipedia"
  [class selector]: https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors "Class selectors"
  [$rootScope.$broadcast]: http://brandonclapp.com/using-angularjs-services-to-broadcast-messages-between-controllers/ "Using AngularJS services to broadcast messages between controllers"
  [filtering]: https://docs.angularjs.org/api/ng/filter/filter "API: filter"
  [CRUD]: https://en.wikipedia.org/wiki/Create%2C_read%2C_update_and_delete "Create, read, update and delete - Wikipedia"
  [mail me]: mailto:r@akinjide.me "Akinjide Bankole' Email"
