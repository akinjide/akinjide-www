---
aliases:
  - /obfuscation/
date: "2020-11-05"
description: "Obfuscate sensitive information in service logs before outputting to STDOUT"
slug: "obfuscation"
tags:
  - "programming"
title: "Obfuscation"
---


![Black Hole Sketch][]


Not to be confused with Obfuscation[^1] of source or machine code. :)

Distributed services require several components to aid in diagnosing and fixing bugs after deployment or during service operation (*i.e. Logging, Monitoring, or Alerting*). Most services will output logs to STDOUT which could in turn be consolidated to a central system, probably operated by a third-party like [Loggly][].

Unfortunately, these logs could contain sensitive information, and most times an entire engineering team could have access to query or aggregate the logs which could pose a security threat if the logging system is lax. Although, there's plenty more considered sensitive information below is some examples:

- Personal Identifiable Information (i.e. First Name, Last Name, Email or House Address)
- Passwords
- IP Addresses
- Authentication Tokens which could include identifiable information.

Limiting access to logging systems could reduce the risk associated with data mishandling, however, redacting or excluding sensitive information from logs is a better approach but not every engineering team has this foundational piece in their early design and it might require great effort to make changes.

Twitter had [service logs issue back in 2018][], and asked it's users to change password not only on Twitter but on services where users have the same password:

> "When you set a password for your Twitter account, we use technology that masks it so no one at the company can see it. We recently identified a bug that stored passwords unmasked in an internal log."

In this article, I'll share a strategy I used several times on production systems and hopefully, your team can determine what information in your logs is considered sensitive and follow this strategy accordingly to keep that information from your service logs.

## How?

In Node.js, I'll show an example strategy to obfuscate sensitive information from service logs at runtime before outputting to STDOUT with [winston][], a third-party module that handles logging, log formatting, and [transport logging][] but the same strategy should work with any [structured logging][] module.

```javascript
import { createLogger, format, transports } from 'winston';

const obfuscateValues = format((info, opts) => {
    if (info.headers) {
        const obfuscateKeys = opts.headers;
        for (let i = 0; i <= obfuscateKeys.length; i++) {
            const obfuscateKey = obfuscateKeys[i];

            if (info.headers[obfuscateKey]) {
                info.headers[obfuscateKey] = `obfuscated, length=${info.headers[obfuscateKey].length}`;
            }
        }
    }

    return info;
});

const { combine, timestamp, json } = format;
const logger = createLogger({
    format: combine(
        timestamp(),
        obfuscateValues({
            headers: ['authorization'],
        }),
        json(),
    ),
    transports: [
        new transports.Console(),
    ]
});

export default logger;
```

- `<Array>info.headers` deny list contains keys for matching incoming requester header.
- `<Function>obfuscateValues` [custom formatter][] will iterate through requester headers and compare with keys in `<Array>info.headers`, replacing any matching key property value with **obfuscated, length=X**, where **X** will equal the matched property value character length.


## Sample log

The below example shows an HTTP GET request to `127.0.0.1:80/wallets` endpoint with some query parameter but if you look further in the structured contextual log within the nested headers object, you'll see **authorization** value has been obfuscated with **length=count_of_authorization_value**.

If this service log gets exposed, it's completely safe because nothing valuable in the log can be used by an attacker to either affect the account owner or service.

```json
{
	"level":"error",
	"message":"/wallets?type=trade: Not Found",
	"timestamp":"2020-11-03T23:40:38.109Z",
	"reqID":"8ac73fea-fae6-4dd1-b162-e8776a3cf723",
	"headers": {
		"authorization":"obfuscated, length=448",
		"user-agent":"PostmanRuntime/7.26.5",
		"accept":"*/*",
		"postman-token":"207d966a-c080-49a1-824c-b3ef643d934a",
		"host":"localhost:8000",
		"accept-encoding":"gzip, deflate, br",
		"connection":"keep-alive",
		"content-type":"application/x-www-form-urlencoded",
		"content-length":"26"
	}
}
```

This strategy doesn't apply to just request headers, it can be extended to request query and body values. If you have questions, just mail me.

  [^1]: [Obfuscation_(software)][] is deliberately creating difficult to read source or machine code, maybe for fun or intellectual property.

  [Black Hole Sketch]: /static/images/2020/black-hole-sketch.png "Black Hole Sketch"
  [Loggly]: https://www.loggly.com "Log Analysis | Log Management by Loggly"
  [service logs issue back in 2018]: https://blog.twitter.com/official/en_us/topics/company/2018/keeping-your-account-secure.html "Keeping your account secure"
  [winston]: https://www.npmjs.com/package/winston "winston - npm"
  [transport logging]: https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#additional-transports "winston/transport.md - GitHub"
  [structured logging]: https://www.sumologic.com/glossary/structured-logging/ "What is Structured Logging | Sumo Logic"
  [custom formatter]: https://www.npmjs.com/package/winston#creating-custom-formats "winston - npm"
  [Obfuscation_(software)]: https://en.wikipedia.org/wiki/Obfuscation_(software) "Obfuscation (software) - Wikipedia"
