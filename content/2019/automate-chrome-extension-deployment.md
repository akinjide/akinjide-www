---
aliases:
  - /automate-chrome-extension-deployment/
date: "2019-04-14"
description: "Automating extension Continuous Deployment with Travis CI and npm script as task runner."
slug: "automate-chrome-extension-deployment"
tags:
  - "programming"
  - "personal development"
  - "devops"
title: "Automate Chrome Extension Deployment"
---


![An Evil Eye Sketch][]


Google Chrome gives developers rich [Chrome APIs][] to interact with the Chrome browser and web pages through extensions[^1]. Extension files are zipped into **.crx** package that users download and install and generally fulfill a single purpose making them easy to understand (i.e. *An extension that allows [shortening URLs][] can contain multiple components and a range of functionality, as long as everything points towards a common purpose*). You can read more about features Google Chrome extension provides and if you have not built an extension in the past, I encourage you to check out [sample extensions][] and read this [getting started tutorial][].

In this article, I will show you how to automate deploying your extension to [Chrome Web Store][]. The traditional way to update your existing extension is through the Chrome Developer Dashboard upload interface and afterwards publish to the [Chrome Web Store][].


![Chrome Web Store Upload Interface][]


This is fine, except you will need to [create your app's zip file][], alongside updating your [manifest.json][] file. I strongly believe in automating simple tasks and with [Travis CI][], you can achieve Continuous Deployment[^2].


## Setup

You will need to have:

- [Node.js and npm][] installed
- [Travis CI][] account and [Travis CI Client (CLI)][] installed
- [Chrome Web Store Developer Account][]
- An existing extension project
- Understanding of [npm and package.json file][]
- [Coffee][]

We will be using [chrome-webstore-upload-cli][], an npm package that provides CLI options that allows interacting with [Chrome Web Store][] API.

```bash
$ npm install chrome-webstore-upload-cli --save-dev
```

[Read this guide][] and follow steps to generate Google API keys. You will need Google API `clientId`, `clientSecret` and `refreshToken`. Keep this safe and secure, it is required for deploying your extension to [Chrome Web Store][].


## Configure

**Travis CI**

Travis CI will enable Continuous Deployment of your extension project to [Chrome Web Store][], confirm you have authorized Travis CI with your GitHub account and activated the extension repository you want to use with Travis CI.

Add a `.travis.yml` file to your extension project, this controls Travis CI behavior.

```bash
$ touch .travis.yml
```

Copy and paste the below into the `.travis.yml` and replace **kcehmhmmioeddhjddnaenanalobejajn** with your extension project `EXTENSION_ID`.


![Getting Extension ID][]


```yaml
language: node_js
node_js:
  - 8.11.3

deploy:
  skip_cleanup: true
  provider: script
  script: npm run deploy
  on:
    branch: master

env:
  EXTENSION_ID=ockddcaogdonfmcfhdb
```

This specifies a Node.js project that should be built with version 8.11.3.

- `deploy` block specifies the command Travis CI will run on the GitHub master branch.
- `env` block specifies environment variables[^3] to include during build.


![Travis CI Environment Variables][]


Add Google API `clientId`, `clientSecret` and `refreshToken` into your Travis CI project settings, environment variables section. Do not check **Display value in build log**.

**npm Scripts**

npm scripts are used to automate common repetitive tasks without the need for tools or external task runners like [Gulp][]. Most of our work will happen in the `package.json` file that npm uses as a manifest.

If you do not have this file, create using npm initialize option

```bash
$ npm init -y
```

and include deploy property in scripts section

```json
{
  "scripts": {
    "deploy": "webstore upload --auto-publish",
  },
  "devDependencies": {
    "chrome-webstore-upload-cli": "^1.2.0",
  }
}
```

You might have other scripts command in your `package.json` file. But this `deploy` script will invoke [chrome-webstore-upload-cli][] upload method with flag **--auto-publish** and will read `EXTENSION_ID`, `CLIENT_ID`, `CLIENT_SECRET` and `REFRESH_TOKEN` from Travis CI environment variables.


## Deploy

Update your extension version field in **manifest.json** file and push this changes alongside any previous change to your extension GitHub repository, master branch and watch Travis CI deploy your changes to [Chrome Web Store][].

You can run the deploy command locally, `npm run deploy` but should fail unless you provide `EXTENSION_ID`, `CLIENT_ID`, `CLIENT_SECRET` and `REFRESH_TOKEN` in your shell.

```bash
$ EXTENSION_ID=xxxx CLIENT_ID=xxxx CLIENT_SECRET=xxxx REFRESH_TOKEN=xxxx npm run deploy
```

## Final Thoughts

By now you should have Continuous Deployment setup with Travis CI and subsequent push to GitHub master branch should trigger build and deploy to [Chrome Web Store][]. I recommend you check out this project, [ufus-extension][] to learn more about extensions and view [chrome-webstore-upload-cli][] setup.

[Mail me][] if you have any questions? Would be happy to help.

  [^1]: An extension is a small program that add new features to your browser, personalize your browsing experience and are built on web technologies such as HTML, CSS and JavaScript. This simplicity makes developing extensions as easy as building web applications.
  [^2]: Continuous Deployment relies on infrastructure that automates steps leading to deploying validated features into production environment.
  [^3]: An environment variable is a named-value field that affect running processes in a system or program behaviour.

  [An Evil Eye Sketch]: /static/images/2019/an-evil-eye-sketch.jpg "An Evil Eye Sketch"
  [Chrome APIs]: https://developer.chrome.com/extensions/api_index "Chrome APIs - Google Chrome"
  [sample extensions]: https://developer.chrome.com/extensions/samples "Sample Extensions - Google Chrome"
  [getting started tutorial]: https://developer.chrome.com/extensions/getstarted "Getting Started Tutorial - Google Chrome"
  [Chrome Web Store]: https://chrome.google.com/webstore/category/extensions "Chrome Web Store"
  [shortening URLs]: https://github.com/akinjide/ufus-extension "GitHub - Ufus extension"
  [create your app's zip file]: https://developer.chrome.com/webstore/publish?hl=en-US#create-your-apps-zip-file "Publish in the Chrome Web Store - Google Chrome"
  [manifest.json]: https://developer.chrome.com/extensions/manifest "Manifest File Format - Google Chrome"
  [Node.js and npm]: https://nodejs.org/en/download/ "Download - Node.js"
  [Travis CI]: https://travis-ci.com "Travis CI - Test and Deploy with Confidence"
  [Travis CI Client (CLI)]: https://github.com/travis-ci/travis.rb#installation "GitHub - Travis CI Client"
  [Chrome Web Store Developer Account]: https://chrome.google.com/webstore/developer/dashboard "Developer Dashboard - Chrome Web Store"
  [npm and package.json file]: https://scotch.io/bar-talk/how-to-build-and-publish-a-npm-package "How to Build and Publish an npm Package - Scotch.io"
  [Coffee]: https://www.quora.com/Why-do-programmers-love-coffee "Coffee - Quora"
  [chrome-webstore-upload-cli]: https://github.com/DrewML/chrome-webstore-upload-cli "GitHub - DrewML/chrome-webstore-upload-cli"
  [Read this guide]: https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md "GitHub - How to generate Google API keys"
  [Chrome Web Store Upload Interface]: /static/images/2019/zvfvykuukkxcq5zfa7ic.png "Chrome Web Store Upload Interface"
  [Gulp]: https://gulpjs.com "The stream build system"
  [Getting Extension ID]: /static/images/2019/fe5wktxxl69hhqkyw8al.png "Getting Extension ID"
  [Travis CI Environment Variables]: /static/images/2019/nhlt0gjldfql5dydbqgp.png "Travis CI Environment Variables"
  [ufus-extension]: https://github.com/akinjide/ufus-extension "GitHub - Ufus extension"
  [Mail me]: mailto:r@akinjide.me "Akinjide Bankole' Email"
