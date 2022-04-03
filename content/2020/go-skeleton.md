---
aliases:
  - /go-skeleton/
date: "2020-03-30"
description: "μ-service Go project layout for engineering teams or individual engineers"
slug: "go-skeleton"
tags:
  - "programming"
  - "personal development"
title: "Go Skeleton"
---

![Stringed Mannequin Sketch][]

My team experimented with [Go][] on our location μ-service in July 2019, and we gained increased performance and a decrease in the number of EC2 instances consumption. After the experiment, we decided it's best we migrated other μ-services from [Node.js][] to [Go][] and ever since we have been gradually migrating our services.

Internally, we struggled with deciding on a Go project structure and after debates, we settled on a modification of [Standard Go Project Layout][] which is quite frankly common in Go ecosystem (i.e. [Kubernetes][], [Prometheus][], [Datadog Agent][]).

Seeing my team go through several Go project structure debates and iteration, I thought, I should share what we finally have and use on our production system and hopefully, it would help engineering teams or individual engineers, that's getting started with μ-services in Go, move fast!

I'll represent the Go structure using a tree structure, which uses:

 - [Docker][],
 - [GNU Make][],
 - [NPM][],
 - [Go Modules][],
 - [Swagger - Swag][],
 - [Revive][],
 - [Reflex][],
 - and [Echo][].

 I'll just be explaining the important bit but you can mail me for better understanding or reference [Standard Go Project Layout][].


```text
/Users/akinjide/go-skeleton

  ├── Makefile
  ├── README.md
  ├── cmd
  │   └── service-go-skeleton
  │       └── main.go
  ├── config
  │   ├── config.go
  │   ├── default.json
  │   ├── dev-docker.json
  │   ├── dev.json
  │   ├── production-preprod.json
  │   ├── production.json
  │   └── staging.json
  ├── docker
  │   ├── Dockerfile
  │   └── docker-entrypoint.sh
  ├── docker-compose.yml
  ├── go.mod
  ├── go.sum
  ├── package-lock.json
  ├── package.json
  ├── pkg
  │   ├── api
  │   │   ├── skeleton
  │   │   │   ├── skeleton.go
  │   │   │   ├── skeleton_test.go
  │   │   │   ├── handler.go
  │   │   │   └── model.go
  │   │   ├── docs
  │   │   │   ├── docs.go
  │   │   │   ├── swagger.json
  │   │   │   └── swagger.yaml
  │   │   ├── healthcheck
  │   │   │   ├── handler.go
  │   │   │   └── handler_test.go
  │   │   └── swagger.go
  │   ├── echo
  │   │   ├── handlers
  │   │   │   ├── http_error_handler.go
  │   │   │   └── router.go
  │   │   └── validators
  │   │       └── default_validator.go
  │   └── services
  │       ├── analytics
  │       │   ├── analytics.go
  │       │   ├── analytics_test.go
  │       │   └── model.go
  │       ├── auth
  │       │   ├── model.go
  │       │   ├── auth.go
  │       │   └── auth_test.go
  │       └── session
  │           ├── model.go
  │           ├── session.go
  │           └── session_test.go
  ├── revive.toml
  ├── scripts
  │   ├── go-run-watch
  │   └── go-test-watch
  └── tools
      ├── build.go
      └── tools.go
```

**Makefile**

[GNU Make][] file contains common, build and deploy tasks (i.e. *test*, *generate_docs*, *clean*, *docker_build* and *lint*), those tasks can be used individually or collectively to check for errors in go files, build the *main.go* file or deploy to a remote docker registry.

**go.***

[go.mod][] and [go.sum][] are both [Go Modules][] files for recording precise dependency requirements and your project can contain one or more Go modules. These files should be committed into a remote source repository which would allow subsequent installation to generate identical modules. Although, Go modules are not fully enabled by default and still actively in development.

**package***

[package-lock.json][] and [package.json][] are both [npm][] files that allow identifying a project and managing its dependencies. The *package-lock.json* file is auto-generated for any modification that affects either the *node_modules* tree, or *package.json*. Since you don't commit your *node_modules* to a remote source repository.

These package* files should be committed into a remote source repository which would allow subsequent installation produce exact package versions as described in *package-lock.json* file.

In *package.json*, we have scripts to accomplish some tasks too alongside Makefile, basically, we use both Makefile and package.json. See example *package.json* below:

```json
{
  "scripts": {
    "test": "make test",
    "precommit": "npm run lint-js",
    "pretest": "npm run lint-js"
  }
}
```

**/cmd**

Project entry-point and usually has directory per application which should be prefixed with **service-** and match the project name (i.e. *service-go-skeleton*) and within the directory, a *main.go* file for setting up middlewares, routers, logging, http-server and importing business logic from **/pkg** directory.

**/config**

Application configurations in the *.json* files need a corresponding struct in *config.go*. In *config.go* you have a function exposing the application configurations per executing environment. See example *config/dev.json* and *config/config.go* below:

```json
{
  "database": {
    "host": "localhost",
    "port": "4567"
  }
}
```

```go
package config

import (
  "os"
  "encoding/json"
  "fmt"
)

type Database struct {
  Host string `json:"host"`
  Port string `json:"port"`
}

type Config struct {
  Database Database `json:"database"`
}

func Load(appEnv string) Config {
  var cfg Config

  config, err := os.Open(fmt.Sprintf("%s.json", appEnv))

  if err != nil {
    panic(err)
  }

  defer config.Close()

  if err := json.NewDecoder(config).Decode(&cfg); err != nil {
    panic(err)
  }

  return cfg
}
```

**/docker**

We use Docker to containerize our applications for seamlessly building and running our application in [Amazon ECS][]. Having *Dockerfile* per executing environment helps with different go build options and enabling debug options. If you have an existing build process, I recommend you keep using that and if you don't use docker or don't want docker you can skip adding this directory.

**pkg/api**

Application routes, JSON schema files, protocol definition files and primary logic are defined in *pkg/api/* directories, directory like healthcheck indicates abstractions for only healthcheck logic. *pkg/api/* can have more directories i.e.:

 - pkg/api/healthcheck
 - pkg/api/skeleton
 - pkg/api/docs
 - pkg/api/media
 - pkg/api/support

all these directories will be injected into *cmd/service-go-skeleton/main.go*.

**pkg/echo**

Application framework dependencies or support files should be categorized by directories for visibility, [Echo][] is highly extensible and that's why we have this directory to track dependencies we develop.

**pkg/services**

Service application directories contain business logic categorized by names for easy imports i.e.:

 - pkg/api/services/analytics
 - pkg/api/services/auth
 - pkg/api/services/session

all these directories will be injected into *pkg/api/* as dependencies.

**scripts**

We use scripts to build, watch and test operations. Scripts help keep root Makefile concise and short. See example *scripts/go-test-watch* below:

```bash
#!/usr/bin/env bash

set -e
set -u
set -o pipefail

reflex -d none -s -R vendor. -R node_modules. -R tmp. -R test.log -r \.go$ -- go test "$@"
```

**tools**

We use support tools (commands) as dependencies which are supported by Go modules. It is useful if you need to install a tool to help with code lint or to watch code changes and restart the running application process.

See example *tools/tools.go* and an excerpt from *Makefile* to install dependencies in *tools.go* to Go module below:

```go
// +build tools

package tools

import (
  _ "github.com/cespare/reflex"
  _ "github.com/mgechev/revive"
  _ "github.com/swaggo/swag/cmd/swag"
)
```

```make
install_tools:
  @for package in $$(grep '_ \"' tools/tools.go | sed 's/_ //g' | sed 's/[^a-zA-Z0-9/.]//g'); do \
    echo "Installing package $${package} or skipping if already installed..."; \
    go install $${package}; \
  done
```

I will add a link to a mock service on GitHub following the Go project layout explained in this article. In the interim, if you need help with naming, formatting, and style, start by running [gofmt][] and [vet][] or send an email.

Also, make sure to read these Go code style guidelines and recommendations:

  - [Go Project Layout][]
  - [Style guideline for Go packages][]
  - [uber-go/guide][]
  - [bahlo/go-styleguide][]
  - [go-modules-by-example/index][]
  - [Clean Architecture in Go][]


  [Stringed Mannequin Sketch]: /static/images/2020/stringed-mannequin-sketch.jpg "Stringed Mannequin Sketch"
  [Go]: https://golang.org "The Go Programming Language"
  [Node.js]: https://nodejs.org "Node.js"
  [Standard Go Project Layout]: https://github.com/golang-standards/project-layout "golang-standards/project-layout: Standard Go Project Layout"
  [Kubernetes]: https://github.com/kubernetes/kubernetes "kubernetes/kubernetes: Production-Grade Container Scheduling and Management"
  [Prometheus]: https://github.com/prometheus/prometheus "prometheus/prometheus: The Prometheus monitoring system and time series database."
  [Datadog Agent]: https://github.com/DataDog/datadog-agent "DataDog/datadog-agent: Datadog Agent"
  [Docker]: https://www.docker.com/why-docker "Why Docker – Docker"
  [GNU Make]: https://www.gnu.org/software/make/ "Make – GNU Project – Free Software Foundation"
  [NPM]: https://www.npmjs.com "npm – build amazing things"
  [Go Modules]: https://github.com/golang/go/wiki/Modules "Modules – golang/go Wiki"
  [Swagger - Swag]: https://github.com/swaggo/swag "swaggo/swag: Automatically generate RESTful API documentation with Swagger 2.0 for Go."
  [Revive]: https://github.com/mgechev/revive "mgechev/revive: 🔥 ~6x faster, stricter, configurable, extensible, and beautiful drop-in replacement for golint."
  [Reflex]: https://github.com/cespare/reflex "cespare/reflex: Run a command when files change"
  [Echo]: https://echo.labstack.com "Echo – High performance, minimalist Go web framework"
  [go.mod]: https://golang.org/cmd/go/#hdr-The_go_mod_file "go - The Go Programming Language"
  [go.sum]: https://golang.org/cmd/go/#hdr-Module_authentication_using_go_sum "go - The Go Programming Language"
  [package-lock.json]: https://nodejs.dev/the-package-lock-json-file "The package-lock file"
  [package.json]: https://nodejs.org/en/knowledge/getting-started/npm/what-is-the-file-package-json "What is the file package.json? – Node.js"
  [Amazon ECS]: https://aws.amazon.com/ecs "Amazon ECS - Run containerized applications in production"
  [gofmt]: https://golang.org/cmd/gofmt/ "gofmt - The Go Programming Language"
  [vet]: https://golang.org/cmd/vet/ "vet - The Go Programming Language"
  [Go Project Layout]: https://medium.com/golang-learn/go-project-layout-e5213cdcfaa2 "Go Project Layout"
  [Style guideline for Go packages]: https://rakyll.org/style-packages/ "Style guideline for Go packages"
  [uber-go/guide]: https://github.com/uber-go/guide/blob/master/style.md "uber-go/guide"
  [bahlo/go-styleguide]: https://github.com/bahlo/go-styleguide "bahlo/go-styleguide: Opinionated Styleguide for the Go language"
  [go-modules-by-example/index]: https://github.com/go-modules-by-example/index "go-modules-by-example/index: Go modules by example is a series of work-along guides"
  [Clean Architecture in Go]: https://medium.com/@hatajoe/clean-architecture-in-go-4030f11ec1b1 "Clean Architecture in Go – Yusuke Hatanaka"
