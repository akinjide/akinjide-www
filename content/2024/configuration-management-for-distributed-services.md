---
aliases:
  - /configuration-management-for-distributed-services/
date: "2024-08-17"
description: "Why bother about distributing your service Configuration?"
slug: "configuration-management-for-distributed-services"
tags:
  - "programming"
  - "personal development"
title: "Configuration Management for Distributed Services"
draft: true
---


![Shadow on Shadow Sketch][]


Traditionally, most engineers or engineering team will store secrets and configuration in the service environment as variables that can be replaced but this will require restarting the service. Hot swap becomes an issue unless you have another service running simultaneously with the new configuration and then you transfer traffic from to the new service that's running your new configuration.




Store config in the environment

An app’s config is everything that is likely to vary between deploys (staging, production, developer environments, etc). This includes:

Resource handles to the database, Memcached, and other backing services
Credentials to external services such as Amazon S3 or Twitter
Per-deploy values such as the canonical hostname for the deploy
Apps sometimes store config as constants in the code. This is a violation of twelve-factor, which requires strict separation of config from code. Config varies substantially across deploys, code does not.

A litmus test for whether an app has all config correctly factored out of the code is whether the codebase could be made open source at any moment, without compromising any credentials.

Note that this definition of “config” does not include internal application config, such as config/routes.rb in Rails, or how code modules are connected in Spring. This type of config does not vary between deploys, and so is best done in the code.

Another approach to config is the use of config files which are not checked into revision control, such as config/database.yml in Rails. This is a huge improvement over using constants which are checked into the code repo, but still has weaknesses: it’s easy to mistakenly check in a config file to the repo; there is a tendency for config files to be scattered about in different places and different formats, making it hard to see and manage all the config in one place. Further, these formats tend to be language- or framework-specific.

The twelve-factor app stores config in environment variables (often shortened to env vars or env). Env vars are easy to change between deploys without changing any code; unlike config files, there is little chance of them being checked into the code repo accidentally; and unlike custom config files, or other config mechanisms such as Java System Properties, they are a language- and OS-agnostic standard.

Another aspect of config management is grouping. Sometimes apps batch config into named groups (often called “environments”) named after specific deploys, such as the development, test, and production environments in Rails. This method does not scale cleanly: as more deploys of the app are created, new environment names are necessary, such as staging or qa. As the project grows further, developers may add their own special environments like joes-staging, resulting in a combinatorial explosion of config which makes managing deploys of the app very brittle.

In a twelve-factor app, env vars are granular controls, each fully orthogonal to other env vars. They are never grouped together as “environments”, but instead are independently managed for each deploy. This is a model that scales up smoothly as the app naturally expands into more deploys over its lifetime.




**Legacy.**

**Modern.**

# Legacy


# Modern


## How?


```json
{
  "server": {
    "port": 8080
  },
  "github": {
    "token": "",
  },
  "jwt": {
    "ttl": "28800",
    "key": "85e793b6d91d11eb9e13e35231c19b45",
    "issuer": "www.akinjide.me",
    "audience": "*.akinjide.me"
  }
}
```

```javascript
import config from 'config';
import LRU from 'lru-cache';
import { v4 as uuidv4 } from 'uuid';

import logger from '../logger';

const defaultCacheTtlMs = config.get('repositories.ttl');
const secretsCache = new LRU();

const createLocalRepository = ({ localConfig = config, serviceName } = {}) => {
    logger.info('Initializing local secrets repository');

    const get = (name, opts) => {
        const root = opts && opts.root ? opts.root : serviceName;
        const keyPathParts = name.replace(/^\//, '').split('/');
        let cfgPath = root;

        if (keyPathParts.length !== 1 && keyPathParts[0] !== '') {
            cfgPath = `${root}.${keyPathParts.join('.')}`;
        }

        logger.info(`Attempting to get parameter ${cfgPath}`);
        return Promise.resolve(localConfig.get(cfgPath));
    };

    return {
        getParameter: get,
        getParameters: get,
    };
};

const createSecretRepository = (name, execFn = (() => {})) => {
    return (storageOpts) => {
        logger.info(`Initializing ${name} secrets repository`);

        // execFn will return methods as type Promise below:
        // return {
        //     getParameter,
        //     getParameters,
        // };
        return execFn(storageOpts);
    };
};

const createDefaultStorage = ({
    storageOpts = {},
    storeName = config.get('repositories.mode'),
    stores = {},
} = {}) => {
    const factory = {
        local: createLocalRepository,
        ...stores,
    }[storeName];

    return factory(storageOpts);
};

/**
 * createParameterRequest - Create a parameterRequest object.
 *
 * In some case you may want to use this function in tests where you want to provide some param
 * To a thing being tested. In this case just create the request with target set to actual value.
 *
 * @param  {function/object} target either function that returns promise or actual value
 * @param  {int} cacheTtlMs Cache TTL ms (valid only if target is function)
 * @return {parameterRequest} Object with a single "fetch" function.
 *                            The function will return promise that resolves to an actual value.
 */
const createParameterRequest = (target, cacheTtlMs = defaultCacheTtlMs) => {
    const cacheKey = uuidv4();

    return {
        /**
         * fetch - get value from underlying storage and cache it.
         *
         * @return {Promise} that will resolve to a parameter value
         */
        fetch() {
            if (typeof (target) !== 'function') {
                return Promise.resolve(target);
            }

            const cachedResult = secretsCache.get(cacheKey);
            if (cachedResult) {
                return Promise.resolve(cachedResult);
            }

            return target()
                .then((result) => {
                    secretsCache.set(cacheKey, result, cacheTtlMs);
                    return result;
                })
                .catch((error) => {
                    if (cachedResult) {
                        logger.error('Failed to fetch secret value', { error });
                        return Promise.resolve(cachedResult);
                    }

                    throw error;
                });
        },
    };
};

function create({
    storageOpts = {},
    storage = createDefaultStorage({ storageOpts }),
    cacheTtlMs = defaultCacheTtlMs,
    secretsLimit = config.get('repositories.limit'),
} = {}) {
    let reqCount = 0;

    const preventParamsMisuse = function () {
        reqCount += 1;
        if (reqCount >= secretsLimit) {
            throw new Error(`You are requesting more than ${secretsLimit} secrets in total which is most likely an indicator of misuse. Make sure you keep the reference of a parameter and fetch it when you need the value rather than getting the param every time you need the value.`);
        }
    };

    return {
        /**
          *  This function returns parameter request object that will resolve to a single parameter value
          *  from underlying storage.
          *  @param {string} name - The name of the parameter
          *  @param {object} opts - Options object. Can have optional "service" key to indicate service
          *                         to get parameter for.
          *  @returns {parameterRequest} paramRequest - Returns parameter request object with single fetch
          *                                             method. Fetch is a promise that resolves to a parameter value
          */
        getParameter: (name, opts) => {
            preventParamsMisuse();
            return createParameterRequest(() => storage.getParameter(name, opts), cacheTtlMs);
        },

        /**
          *  This function returns parameter request object that will resolve to a parameters object taken
          *  from underlying storage.
          *  @param {string} name - The name of the parameters object
          *  @param {object} opts - Options object. Can have optional "service" key to indicate service to
          *                         get parameter for.
          *  @returns {parameterRequest} paramRequest - Returns parameter request with single fetch method.
          *                                             Fetch is a promise that resolves to a parameter value
          */
        getParameters: (name, opts) => {
            preventParamsMisuse();
            return createParameterRequest(() => storage.getParameters(name, opts), cacheTtlMs);
        },
    };
}

const ensureHasSecret = ({ value, name }) => {
    if (value.length === 0) {
        throw new Error(`Secret not found for ${name}`);
    }
    // if (!value) {
    //     return Promise.reject('Config not found for ' + cfgPath);
    // }
};

const resolvedPaths = {};
const getSecretPath = ({ name, root }) => {
    const memoizeKey = `name: ${name}; root: ${root}`;
    if (resolvedPaths[memoizeKey]) {
        return resolvedPaths[memoizeKey];
    }

    const keyPathParts = name.replace(/^\//, '').split('/');
    let cfgPath = root;

    if (keyPathParts.length !== 1 && keyPathParts[0] !== '') {
        cfgPath = `${root}.${keyPathParts.join('.')}`;
    }

    resolvedPaths[memoizeKey] = cfgPath;

    return cfgPath;
};

const storage = {
    createLocalRepository,
    createSecretRepository,
};

export {
    storage,

    create,
    createDefaultStorage,
    createParameterRequest,

    ensureHasSecret,
    getSecretPath,
};
```

```javascript
import { storage, ensureHasSecret, getSecretPath } from '../secrets';
import logger from '../../logger';
import Request from '../../http/request';
import interval from '../../../scheduler/interval';

const getValue = (result, path) => {
    let current = result;

    for (var i = 0; i < path.length; i++) {
        if (!current[path[i]]) {
            return null;
        }

        current = current[path[i]];
    }

    return current;
};

const name = 'github';
const repository =  storage.createSecretRepository(name, ({
    serviceName,
    pkg,
    env = 'default',
    repositoriesCfg = {},
}) => {
    // TODO: This is potentially subject of request rate limit, needs investigation
    const path = `akinjide/pinn/master/config/${env}.json`;
    const r = new Request({ url: repositoriesCfg.github.address, pkg });
    let result;

    interval({
        frequency: repositoriesCfg.github.replicationMS,
        name: 'sync github secrets',
        fn: async (err) => {
            if (err) {
                // log error and wait till next schedule
                logger.error('sync error: github secrets', { message: err });
                return;
            }

            result = await r.send('GET', path, null, { 'Authorization': `Bearer ${repositoriesCfg.github.token}` });
            logger.info(result);
        },
    });

    return {
        getParameter: (name, opts) => {
            const root = opts && opts.root ? opts.root : serviceName;
            const cfgPath = getSecretPath({ name, root });
            logger.info('Attempting to get GitHub parameter', { path: cfgPath });
            const value = getValue(result, cfgPath.split('.'));
            ensureHasSecret({ value, name: cfgPath });
            return Promise.resolve(value);
        },
        getParameters: (names, opts) => {
            const root = opts && opts.root ? opts.root : serviceName;

            return Promise.resolve(names.map(name => {
                const cfgPath = getSecretPath({ name, root });
                logger.info('Attempting to get GitHub parameter', { path: cfgPath });
                const value = getValue(result, cfgPath.split('.'));
                ensureHasSecret({ value, name: cfgPath });
                return value;
            }));
        },
    };
});

export {
    name,
    repository,
};
```

```javascript
import config from 'config';

import * as s from './secrets';
import * as github from './repositories/github';
import pkg from '../../../package.json';

const remoteCfg = s.create({
    storage: s.createDefaultStorage({
        storageOpts: {
            serviceName: pkg.name,
            pkg,
            repositoriesCfg: config.get('repositories'),
        },
        stores: {
            [github.name]: github.repository,
        },
    }),
});

remoteCfg.getParameter('')
```

### Build Time

### Run Time


## Final Thoughts

*Co - Authored by Akintaylor Akinbowale*
https://nickjanetakis.com/blog/docker-tip-47-build-time-vs-run-time-env-variables

  [Shadow on Shadow Sketch]: /static/images/2021/shadow-on-shadow-sketch.jpg "Shadow on Shadow Sketch"
