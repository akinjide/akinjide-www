---
aliases:
  - /scheduling-background-tasks/
date: "2020-12-23"
description: "Scheduling tasks to perform operations like monitoring, notification and data pushing"
slug: "scheduling-background-tasks"
tags:
  - "programming"
title: "Scheduling Background Tasks"
---


![Psycho With Knives Sketch][]


In server-side web programming, background tasks can be scheduled to perform different operations (*i.e. sending a request to a weather server every 30 seconds requesting global weather data*) and without further input from you the programmer, however, the background task should not block incoming and outgoing traffic.

In this article, I will show you how to accomplish this without blocking HTTP traffic and since I've been programming in Go for quite a while now, you'll see both JavaScript and Go examples and you can pick whichever strikes your cord.


# In JavaScript

In-depth explanation immediately after the code below. Read on [Asynchronous][], [Async/Await][], and [setInterval][] in JavaScript, if you don't know about those concepts.

```javascript
// filename: app.js

const express = require('express');
const app = express();

const scheduler = ({
    frequency = 60000, // default 1min
    name,
    fn = () => {},
}) => {
    console.log(`starting scheduler:${name} with freq:${(frequency / 1000)}s`);

    const run = () => setInterval(async () => {
        try {
            console.log('ping', new Date());
            // on interval, invoke fn asynchronously
            await fn(null);
        } catch (err) {
            fn(err);
        }
    }, frequency);

    return run();
};

const ping = (t) => new Promise(resolve => resolve(`pong:${t.toISOString()}`), 1000);

app.get('/hello', (req, res) => {
    console.log(req.connection.remoteAddress, req.method, ":", req.url)
    res.send('Hello World!')
});

app.listen(8000, () => {
    console.log('on localhost:8000');

    const timer = scheduler({
        frequency: 10000, // 10s
        name: 'ping',
        fn: async (err) => {
            if (err) {
                console.log(err);
                clearInterval(timer);
                process.exit(1); // or handle err gracefully
            }

            console.log(await ping(new Date()));
        },
    });
});
```

[Express.js][], a Node.js web application framework configured to receive HTTP traffic at `GET /hello` endpoint on port 8000 and immediately after executes `<Function>scheduler` which runs repeatedly at successive intervals and on each subsequent run executes `<Function>fn`. If error occurred after invocation, it executes `<Function>fn` with a known error.


## Snippets Explanation

```javascript
const scheduler = ({
    frequency = 60000, // default 1min
    name,
    fn = () => {},
}) => {
    console.log(`starting scheduler:${name} with freq:${(frequency / 1000)}s`);

    const run = () => setInterval(async () => {
        try {
            console.log('ping', new Date());
            // on interval, invoke fn asynchronously
            await fn(null);
        } catch (err) {
            fn(err);
        }
    }, frequency);

    return run();
};
```

`<Function>scheduler` accepts an object parameter with three properties and returns a `<Class>Timeout` after executing `<Function>run`.

- `<Number>frequency` indicates how many milliseconds should elapse before triggering `<Function>setInterval`.
- `<String>name` allows naming scheduler better, use if more than one running scheduler.
- `<Function>fn` refers to grouped statements to execute at intervals.

```javascript
const ping = (t) => new Promise(resolve => resolve(`pong:${t.toISOString()}`), 1000);
```

`<Function>ping` mimics an external API with *1000ms* latency and response **pong:2020-12-09T20:27:49.360Z**.

```javascript
const timer = scheduler({
    frequency: 10000, // 10s
    name: 'ping',
    fn: async (err) => {
        if (err) {
            console.log(err);
            clearInterval(timer);
            process.exit(1); // or handle err gracefully
        }

        console.log(await ping(new Date()));
    },
});
```

`<Function>scheduler` executed with frequency *10s*, name *ping* and declares `<Function>fn`. If no error, executes `<Function>ping` and outputs **pong:2020-12-09T20:27:49.360Z** to console.

If an error occurs during execution will output an error message to the console, clear the scheduled interval, and terminate the process with failure code.


## Run the code

Running the code from file with `node app.js`, you'll see each **ping 2020-12-09T20:27:49.359Z** has a *10s* difference:

```bash
> node app.js
on localhost:8000
starting scheduler:ping with freq:10s
::1 GET : /hello
::1 GET : /hello
::1 GET : /hello
::1 GET : /hello
::1 GET : /hello
ping 2020-12-09T20:27:49.359Z
pong:2020-12-09T20:27:49.360Z
::1 GET : /hello
ping 2020-12-09T20:27:59.364Z
pong:2020-12-09T20:27:59.364Z
::1 GET : /hello
::1 GET : /hello
ping 2020-12-09T20:28:09.370Z
pong:2020-12-09T20:28:09.370Z
::1 GET : /hello
::1 GET : /hello
::1 GET : /hello
::1 GET : /hello
::1 GET : /hello
::1 GET : /hello
ping 2020-12-09T20:28:19.376Z
pong:2020-12-09T20:28:19.376Z
ping 2020-12-09T20:28:29.380Z
pong:2020-12-09T20:28:29.380Z
```


# In Go

In-depth explanation immediately after the code below. Read on [Concurrency][], [Goroutines][] and [time][] in Go, if you don't know about those concepts and packages.

```golang
// filename: main.go

package main

import (
    "fmt"
    "net/http"
    "time"
)

func scheduler(frequency time.Duration, name string, fn func(t time.Time)) {
    fmt.Println("starting scheduler:" + name + " with freq:" + frequency.String())

    // schedule for repeated fetch in a looping goroutine
    ticker := time.Tick(frequency)
    go (func() {
        for tickTime := range ticker {
            fmt.Println("ping", tickTime.String())

            // on interval, invoke fn concurrently
            go (func(t time.Time) {
                fn(t)
            })(tickTime)
        }
    })()
}

func ping(t time.Time) (string, error) {
    time.Sleep(time.Duration(1000 * time.Millisecond))
    return fmt.Sprintf("pong:%s", t.String()), nil
}

func main() {
    scheduler(10 * time.Second, "ping", func(t time.Time) {
        var (
            res string
            err error
        )

        if res, err = ping(t); err != nil {
            panic(err) // or handle err gracefully
        }

        fmt.Println(res)
    })

    http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
        fmt.Println(r.RemoteAddr, r.Method, ":", r.URL.Path)
        fmt.Fprintf(w, "Hello World!")
    });

    fmt.Printf("on localhost:8001\n")
    if err := http.ListenAndServe(":8001", nil); err != nil {
        panic(err)
    }
}
```

Golang built-in [net/http][] package configured to receive HTTP traffic at `GET /hello` endpoint on port 8001 which starts immediately after `<Function>scheduler` executes.

`<Function>scheduler` runs repeatedly at successive intervals in a goroutine and on each run executes `<Function>fn` in a goroutine.


## Snippets Explanation

```golang
package main

import (
    "fmt"
    "time"
)

func scheduler(frequency time.Duration, name string, fn func(t time.Time)) {
    fmt.Println("starting scheduler:" + name + " with freq:" + frequency.String())

    // schedule for repeated fetch in a looping goroutine
    ticker := time.Tick(frequency)
    go (func() {
        for tickTime := range ticker {
            fmt.Println("ping", tickTime.String())

            // on interval, invoke fn concurrently
            go (func(t time.Time) {
                fn(t)
            })(tickTime)
        }
    })()
}
```

[fmt][] and [time][] package imported to handle string manipulation and time operations respectively. `<Function>scheduler` accepts three parameters with the third parameter a callback to be executed in a goroutine.

- `<Function>Tick` provides access to the ticking channel which returns time after `frequency`.
- `<Chan>ticker` stores time sending only channel from `time.Tick`

The outer goroutine runs `<Chan>ticker` repeatedly and each repetition starts a new goroutine which executes the callback `<Function>fn` with `<Time>tickTime` as argument.

```golang
func ping(t time.Time) (string, error) {
    time.Sleep(time.Duration(1000 * time.Millisecond))
    return fmt.Sprintf("pong:%s", t.String()), nil
}
```

`<Function>ping` mimics an external API with *1000ms* latency and response *pong:2020-12-09 12:57:41.15116 -0800 PST m=+10.005110477*.

```golang
func main() {
    scheduler(10 * time.Second, "ping", func(t time.Time) {
        var (
            res string
            err error
        )

        if res, err = ping(t); err != nil {
            panic(err) // or handle err gracefully
        }

        fmt.Println(res)
    })
}
```

`<Function>main` executes `<Function>scheduler` which executes with frequency *10s*, name *ping* and declares a callback with time as a parameter. If no error after executing `<Function>ping`, it outputs *pong:2020-12-09 12:57:41.15116 -0800 PST m=+10.005110477* to console.

If an error occurs after `<Function>ping` execution, it will panic and terminate the process with an error message outputted to the console.

- `<String>res` stores the result from `<Function>ping`.
- `<Error>err` stores the error from `<Function>ping` if an error occurs.


## Run the code

Running the code from file with `go run main.go`, you'll see each *2020-12-09 12:57:41.15116 -0800 PST m=+10.005110477* has *10s* difference:

```bash
> go run main.go

starting scheduler:ping with freq:10s
on localhost:8001
[::1]:57707 GET : /hello
[::1]:57708 GET : /hello
[::1]:57709 GET : /hello
[::1]:57711 GET : /hello
[::1]:57712 GET : /hello
[::1]:57713 GET : /hello
[::1]:57714 GET : /hello
[::1]:57715 GET : /hello
[::1]:57716 GET : /hello
ping 2020-12-09 12:57:41.15116 -0800 PST m=+10.005110477
[::1]:57719 GET : /hello
pong:2020-12-09 12:57:41.15116 -0800 PST m=+10.005110477
[::1]:57722 GET : /hello
[::1]:57723 GET : /hello
ping 2020-12-09 12:57:51.151546 -0800 PST m=+20.005397623
pong:2020-12-09 12:57:51.151546 -0800 PST m=+20.005397623
ping 2020-12-09 12:58:01.152014 -0800 PST m=+30.005766084
pong:2020-12-09 12:58:01.152014 -0800 PST m=+30.005766084
ping 2020-12-09 12:58:11.151532 -0800 PST m=+40.005183885
pong:2020-12-09 12:58:11.151532 -0800 PST m=+40.005183885
ping 2020-12-09 12:58:21.150879 -0800 PST m=+50.004431613
pong:2020-12-09 12:58:21.150879 -0800 PST m=+50.004431613
```

Enjoy!

  [Psycho With Knives Sketch]: /static/images/2020/psycho-with-knives-sketch.jpg "Psycho With Knives Sketch"
  [Asynchronous]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous "Asynchronous JavaScript | MDN"
  [Async/Await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function "JavaScript | MDN"
  [setInterval]: https://nodejs.org/api/timers.html#timers_setinterval_callback_delay_args "Timers | Node.js"
  [Express.js]: https://expressjs.com "Express - Node.js web application framework"
  [Concurrency]: https://golangbot.com/concurrency/ "Understanding Concurrency in Golang - golangbot"
  [Goroutines]: https://golangbot.com/goroutines/ "Goroutines - Concurrency in Golang"
  [time]: https://golang.org/pkg/time/ "time - The Go Programming Language"
  [fmt]: https://golang.org/pkg/fmt/ "fmt - The Go Programming Language"
  [net/http]: https://golang.org/pkg/net/http/ "http - The Go Programming Language"

