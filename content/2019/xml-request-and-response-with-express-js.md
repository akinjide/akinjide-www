---
aliases:
  - /xml-request-and-response-with-express-js/
date: "2019-06-20"
description: "eXtensible Markup Language serialization with Node.js isn't complex but time consuming"
slug: "xml-request-and-response-with-express-js"
tags:
  - "programming"
  - "personal development"
title: "XML Request and Response with Express.js"
---


![Uchiha Madara Licks Blood Sketch][]


XML or eXtensible Markup Language[^1] is a widely used markup language that allows storing or interchanging data on the internet. I recently worked on a project that required validating, processing and responding with either XML or JSON request from the client. After hunting around for the most elegant solution, I figured I should write a quick post explaining how I achieved parsing XML using [Node.js][] and its web application framework, Express.js.


## The Story

Admittedly, nobody is thrilled to work with XML and if you are like me, you will avoid XML at all cost and use JSON whenever you can.

Even though processing XML data has become less common, some services and APIs use this format and it's the responsibility of the developers to handle XML. Essentially, you will eventually have to deal with XML.

Previously, I had a simple program that gives a JSON response for its routes.

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import pgp from 'pg-promise';
import promise from 'bluebird';

const connect = (config) => {
  const pg = pgp({
    promiseLib: promise,
    noWarnings: true
  });

  return pg(config.DATABASE_URL);
};

const port = process.env.PORT || 1334;
const app = express();
const connection = connect({
  DATABASE_URL: 'postgresql://localhost/xml_dev_db',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.disable('x-powered-by');
app.set('port', port);

app.post('/users', (request, response) => {
  const { username, email, password } = request.body;
  const sql = `
    INSERT INTO users (
      username,
      email,
      password)
    VALUES($1, $2, $3)
    RETURNING
      id,
      username`;

  connection
    .one(sql, [username, email, randomHashAlgorithm(password)])
    .then((result) =>
      response
        .status(200)
        .json(result)
    )
    .catch((error) =>
      response
        .status(500)
        .json({
          message: 'INTERNAL SERVER ERROR'
        })
    );
});

app.get('/users', (request, response) => {
  const sql = 'SELECT * FROM users';

  connection
    .any(sql)
    .then((result) => {
      if (result && result[0]) {
        return response
          .status(200)
          .json({ Users: result });
      }

      return response
        .status(200)
        .json({
          message: 'NO USERS FOUND',
        });
    })
    .catch((error) =>
      response
        .status(500)
        .json({
          message: 'INTERNAL SERVER ERROR'
        })
    );
});

app.listen(port);
console.log(`SERVER: started on port ${port}`);
```

And corresponding response from the program above:

```json
{
  "Users": [
    {
      "id": "203ef718-1fe5-43fc-b211-45c5af037653",
      "username": "Yasmine",
      "email": "yasmine29@gmail.com",
    },
    {
      "id": "fbec7f9c-a2ad-48eb-ab40-fdfc7074a936",
      "username": "Barbara",
      "email": "bradly61@gmail.com",
    },
    {
      "id": "69933c74-6266-408f-97b7-6db540ceb92e",
      "username": "Marquis",
      "email": "jalen_marquis@yahoo.com",
    }
  ]
}
```

Knowing the requirement was to design an endpoint that supports both JSON and XML, I asked myself, *How can I make an XML response equivalent to the JSON above?*, *How do I respond in XML using Node.js and ExpressJS Framework?*, *How do Node.js folks work with XML?*

My thought, **convert XML to JSON, validate the payload as JSON and convert JSON back to XML if valid otherwise throw an error.** I did a POC (Proof of Concept) with several third-party libraries:

- [xmlbuilder][]
- [xml2json][]
- [xml-js][]
- [object-to-xml][]
- [xml2js][]
- [xml][]

But I ended up using [xml2js][] because it provided robust configuration options, precise JSON to XML conversion and intuitive methods.

Here's a code snippet using xml2js library, but you can use any XML libraries available on npm:

```javascript
import xml from 'xml2js';

// XML Builder configuration, https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class.
const builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

console.log(builder.buildObject({
  'Users': {
    'User': [
      {
        'id': '203ef718-1fe5-43fc-b211-45c5af037653',
        'username': 'Yasmine',
        'email': 'yasmine29@gmail.com',
      },
      {
        'id': 'fbec7f9c-a2ad-48eb-ab40-fdfc7074a936',
        'username': 'Barbara',
        'email': 'bradly61@gmail.com',
      },
      {
        'id': '69933c74-6266-408f-97b7-6db540ceb92e',
        'username': 'Marquis',
        'email': 'jalen_marquis@yahoo.com',
      }
    ]
  }
}));
```
Below is the XML you should receive:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Users>
  <User>
    <id>203ef718-1fe5-43fc-b211-45c5af037653</id>
    <username>Yasmine</username>
    <email>yasmine29@gmail.com</email>
  </User>
  <User>
    <id>fbec7f9c-a2ad-48eb-ab40-fdfc7074a936</id>
    <username>Barbara</username>
    <email>bradly61@gmail.com</email>
  </User>
  <User>
    <id>69933c74-6266-408f-97b7-6db540ceb92e</id>
    <username>Marquis</username>
    <email>jalen_marquis@yahoo.com</email>
  </User>
</Users>
```

For a deeper understanding of how it converts JSON-objects to XML, refer to the module documentation and you'll have to do more work if you need a specific XML format returned, of course.

Unfortunately, since express-based application does not parse incoming raw XML-body requests natively, I began researching for third-party libraries that parse XML to JSON. Eureka, I found a convenient package [express-xml-bodyparser][], an XML bodyparser middleware module that handles converting XML into a JSON-object and attach JSON-object to the request body. Although, express-xml-bodyparser uses xml2js internally and lets you:

- Use exact configuration options that xml2js supports.
- Add the parser at the application level, or for specific routes only.
- Customize the mime-type detection.
- Accept any XML-based content-type, e.g. application/rss+xml.
- Skip data parsing immediately if no req-body has been sent.
- Attempt to parse data only once, even if the middleware is called multiple times.
- Use type-definitions if you're using Typescript.

After integrating both xml2js and express-xml-bodyparser:

```bash
$ npm install express-xml-bodyparser xml2js --save
```

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import pgp from 'pg-promise';
import promise from 'bluebird';
// https://github.com/macedigital/express-xml-bodyparser depends on xml2js internally.
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';

const connect = (config) => {
  const pg = pgp({
    promiseLib: promise,
    noWarnings: true
  });

  return pg(config.DATABASE_URL);
};

const port = process.env.PORT || 1334;
const app = express();
const connection = connect({
  DATABASE_URL: 'postgresql://localhost/xml_dev_db',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.disable('x-powered-by');
app.set('port', port);

// XML Parser configurations, https://github.com/Leonidas-from-XIV/node-xml2js#options
const xmlOptions = {
  charkey: 'value',
  trim: false,
  explicitRoot: false,
  explicitArray: false,
  normalizeTags: false,
  mergeAttrs: true,
};

// XML Builder configuration, https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class.
const builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

const bustHeaders = (request, response, next) => {
  request.app.isXml = false;

  if (request.headers['content-type'] === 'application/xml'
    || request.headers['accept'] === 'application/xml'
  ) {
    request.app.isXml = true;
  }

  next();
};

const buildResponse = (response, statusCode, data, preTag) => {
  response.format({
    'application/json': () => {
      response.status(statusCode).json(data);
    },
    'application/xml': () => {
      response.status(statusCode).send(builder.buildObject({ [preTag]: data }));
    },
    'default': () => {
      // log the request and respond with 406
      response.status(406).send('Not Acceptable');
    }
  });
};

app.post('/users', bustHeaders, xmlparser(xmlOptions), (request, response) => {
  const { username, email, password } = (request.body['User'] || request.body);
  const sql = `
    INSERT INTO users (
      username,
      email,
      password)
    VALUES($1, $2, $3)
    RETURNING
      id,
      username`;

  connection
    .one(sql, [username, email, randomHashAlgorithm(password)])
    .then((result) => {
      return buildResponse(response, 200, result, 'User');
    })
    .catch((error) => buildResponse(response, 500, { message: 'INTERNAL SERVER ERROR' }));
});

app.get('/users', bustHeaders, (request, response) => {
  const sql = 'SELECT * FROM users';

  if (request.app.isXml) {
    response.setHeader('Content-Type', 'application/xml');
  }

  connection
    .any(sql)
    .then((result) => {
      if (result && result[0]) {
        return buildResponse(response, 200, { Users: result }, 'Data');
      }

      return buildResponse(response, 200, { message: 'NO USERS FOUND' });
    })
    .catch((error) => buildResponse(response, 500, { message: 'INTERNAL SERVER ERROR' }));
});

app.listen(port);
console.log(`SERVER: started on port ${port}`);
```

Now, suppose you have an XML document that looks something like above, the Express.js server will process the request.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<User>
  <username>Akinjide</username>
  <email>r@akinjide.me</email>
  <password>00099201710012205354422</password>
</User>
```

And respond with either JSON or XML depending on HTTP header, [Accept][][^2].

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<User>
  <id>45c5af037653-b211-43fc-1fe5-203ef718</id>
  <username>Akinjide</username>
</User>
```


## The Lesson

In trying to please potential users of your service, you may be tempted to implement different serialization format (i.e. [XML][], [JSON][], [YAML][]). However, try to keep things simple and pick a single serialization format and stick with it, especially since JSON is becoming more ubiquitous in REST APIs.

Nonetheless, there are special cases where you'll need to support more serialization format, do keep in mind not to exceed three. Having a simple product code and documentation will make your clients happy and will most definitely save you time and serialization complexities.


  [^1]: [XML or eXtensible Markup Language][] is derived from SGML and defines a set of rules for encoding documents that is both human and machine readable. With emphasis on simplicity, generality, and usability across the Internet.
  [^2]: Accept header informs the server about the types of data that can be sent back to the client.

  [Uchiha Madara Licks Blood Sketch]: /static/images/2019/uchiha-madara-licks-blood-sketch.jpg "Uchiha Madara Licks Blood Sketch"
  [Node.js]: https://nodejs.org/en/download/ "Download - Node.js"
  [xml2json]: https://www.npmjs.com/package/xml2json "xml2json - npm"
  [xml-js]: https://www.npmjs.com/package/xml-js "xml-js - npm"
  [object-to-xml]: https://www.npmjs.com/package/object-to-xml "object-to-xml - npm"
  [xml]: https://www.npmjs.com/package/xml "xml - npm"
  [xmlbuilder]: https://www.npmjs.com/package/xmlbuilder "xmlbuilder - npm"
  [xml2js]: https://www.npmjs.com/package/xml2js "xml2js - npm"
  [express-xml-bodyparser]: https://www.npmjs.com/package/express-xml-bodyparser "express-xml-bodyparser - npm"
  [Accept]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept "Accept - MDN"
  [XML or eXtensible Markup Language]: https://en.wikipedia.org/wiki/XML "XML - Wikipedia"
  [XML]: http://www.w3.org/TR/rec-xml "Extensible Markup Language (XML)"
  [JSON]: https://json.org "JSON"
  [YAML]: https://yaml.org "The Official YAML Web Site"
