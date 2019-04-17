---
aliases:
  - /upsert-rows-in-postgresql/
date: "2018-02-01"
description: "PostgreSQL 9.5 and beyond, now provides a better way to upsert data."
slug: "upsert-rows-in-postgresql"
tags:
  - "programming"
  - "personal development"
title: "Upsert Rows in PostgreSQL"
---


![Angel Pulling Sketch][]


PostgreSQL, version 9.5, provides a better way to _upsert_, or _merge_ a record into a table. This sounds terribly simple, however, consider how you might perform an update or insert without this feature, you could _select_ an existing record -- if it exist you perform an _update_, otherwise you freshly _insert_ as a new record depending on the result of the _select_ query. Between _select_, _update_ and _insert_, a record change or deletion could have occurred under concurrency.

Alternatively, you can do an _update_ first and if it fails then _insert_, but we still get the same concurrency problem, because there's decision making within your application code and returning to the database for execution or locking the table while executing statements is another option, which introduces table contention instead of concurrency. PostgreSQL documentation includes an example upsert using [PL/pgSQL][] to create a [custom upsert][] function, to get around the problems highlighted above but in turn opens up the question of working out what caused an error when inserting. Other options include using [transactions and rollback][] to upsert and with PostgreSQL 9.1, we can take advantage of [Writeable Common Table Expressions][] to upsert records. But that's just piling performance draining complexity into the database.

Now in PostgreSQL 9.5, the developers came up with a solution "conflict resolution". When an _insert_ statement is run and some key, conflicts with a constraint on one of the indexes that _insert_ statement would fail, however, the _ON CONFLICT_ clause lets you catch those conflicts and take alternative action. There's no concurrency to worry about, it's a simple, coherent extension of SQL's _insert_ which encapsulates most use cases.

Before we look at the "upsert" feature, let's create an example table for illustrative purposes:


### Create _users_ Table

Let's model the **users table** we need to represent users. Each user would have a unique **username**, and can change their username at any time. Also, feel free to follow along in your own [PSQL][] session.

So, the table:

```sql
create table users (
  id VARCHAR PRIMARY KEY DEFAULT 'user-' || LOWER(REPLACE(
    CAST(uuid_generate_v1mc() AS VARCHAR(50))
    , '-','')
  ),
  username VARCHAR(15) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  gender VARCHAR(6) NOT NULL,
  email VARCHAR(254),
  password VARCHAR(254),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```


### Populate

For this, we, of course, need some users. _INSERT_ 3 user into the **users table**.
```sql
INSERT INTO users (username, first_name, last_name, gender, email, password)
VALUES
  ('akinjide', 'Akinjide', 'Bankole', 'Male', 'r@akinjide.me', 'wR13jwL'),
  ('theresa9', 'Theresa', 'Cook', 'Female', 'theresa@agaseh.gbe', 'ys2cb'),
  ('lvargas', 'Lucile', 'Vargas', 'Female', 'lvargas@jokiw.fr', 'k1ER1D8');


SELECT id, username, created_at, updated_at FROM users;

                  id                   |   username   |          created_at           |          updated_at
---------------------------------------+--------------+-------------------------------+-------------------------------
 user-b363a322ffd511e7ad4dc3e64ded791e | akinjide     | 2018-01-22 16:38:16.079606-08 |
 user-b363c528ffd511e7ad4da3ed1afa156a | theresa9     | 2018-01-22 16:38:16.079606-08 |
 user-b363c730ffd511e7ad4d33e4d030c094 | lvargas      | 2018-01-22 16:38:16.079606-08 |
(3 rows)
```


### Upsert

Below, if the **username** conflicts with an existing record in the **users table**, the _on conflict_ clause is triggered which executes the update statement and the _where_ clause specifies the exact record to be updated. That's an upsert.

Now that Akinjide is a user, we can run this statement below to update password.

```sql
SELECT id, username, password, updated_at FROM users WHERE username = 'akinjide';

                  id                   | username | password |          updated_at
---------------------------------------+----------+----------+-------------------------------
 user-b363a322ffd511e7ad4dc3e64ded791e | akinjide | wR13jwL   |
(1 row)


INSERT into users (username, first_name, last_name, gender, email, password)
VALUES (
  'akinjide',
  'Akinjide',
  'Bankole',
  'Male',
  'r@akinjide.me',
  'wR13jwL'
)
ON CONFLICT (username)
DO UPDATE SET (
  password,
  updated_at
) = ('8ZiUiF', NOW())
WHERE users.username = 'akinjide';

SELECT id, username, password, updated_at FROM users WHERE username = 'akinjide';

                  id                   | username | password |          updated_at
---------------------------------------+----------+----------+-------------------------------
 user-b363a322ffd511e7ad4dc3e64ded791e | akinjide | 8ZiUiF   | 2018-01-22 16:48:45.997687-08
(1 row)
```


You now have a basic idea of how to use _INSERT_ -- _ON CONFLICT_ to perform an upsert. Here's another example, if the user already exist then we just update the **updated_at** column otherwise insert a new user record.

We'll insert a new user, Warren, into the **users table**.

```sql
INSERT into users (username, first_name, last_name, gender, email, password)
VALUES (
  'warrenbryant',
  'Warren',
  'Bryant',
  'Male',
  'warren.bryant@ha.am',
  '60128c'
)
ON CONFLICT (username)
DO UPDATE SET (updated_at) = (NOW())
WHERE users.username = 'warrenbryant';

SELECT id, username, password, created_at, updated_at FROM users;

                  id                   |   username   | password |          created_at           |          updated_at
---------------------------------------+--------------+----------+-------------------------------+-------------------------------
 user-b363c528ffd511e7ad4da3ed1afa156a | theresa9     | ys2cb    | 2018-01-22 16:38:16.079606-08 |
 user-b363c730ffd511e7ad4d33e4d030c094 | lvargas      | k1ER1D8  | 2018-01-22 16:38:16.079606-08 |
 user-b363a322ffd511e7ad4dc3e64ded791e | akinjide     | 8ZiUiF   | 2018-01-22 16:38:16.079606-08 | 2018-01-22 16:48:45.997687-08
 user-f713151affd711e7ad4d23197a190efa | warrenbryant | 60128c   | 2018-01-22 16:54:28.635996-08 |
(4 rows)
```


### Analyze

The username field is, of course, our index and everything is normal SQL:

- ON CONFLICT clause needs to resolve the conflict; if the conflict matches the *conflict_target* `(username)` after ON CONFLICT, the *conflict_action* `UPDATE SET (updated_at) = (NOW())` after the DO are executed.
- the *conflict_target* `(username)` can be one or more column names or can use ON CONSTRAINT `users_username_key` and directly name the index which gives more flexibility in identifying the conflict source.
- the *conflict_action* `UPDATE SET (updated_at) = (NOW())`, can either be UPDATE or NOTHING.
- adding a WHERE clause to ON CONFLICT -- DO UPDATE only applies the update when the WHERE condition is met.


## Thoughts

Upserting in PostgreSQL 9.5 and beyond offers a lot more with the _on conflict_ clause. [PostgreSQL INSERT][] documentation has the full specification and you can read up on all the nitty-gritty details if you'd like.

That's really all there is to upserting, I'd suggest choosing the new upsert feature, though the difference may seem small in the contrived example above, but the new upsert is free of concurrency and conceptually simpler. If you're already using the on conflict clause in your applications, whether for upserting or otherwise, message me how you're using it.

  [Angel Pulling Sketch]: /static/images/2018/angel-pulling-sketch.jpg "Angel Pulling Sketch"
  [PL/pgSQL]: https://www.postgresql.org/docs/current/static/plpgsql-control-structures.html#PLPGSQL-UPSERT-EXAMPLE "PostgreSQL documentation, custom upsert function"
  [custom upsert]: http://stackoverflow.com/a/1109198/535590 "StackOverFlow, Custom Upsert with PL/pgSQL"
  [transactions and rollback]: https://www.depesz.com/2012/06/10/why-is-upsert-so-complicated/ "Why is Upsert so complicated, Article by depesz"
  [Writeable Common Table Expressions]: https://www.postgresql.org/docs/9.5/static/queries-with.html#QUERIES-WITH-MODIFYING "WITH Queries (Common Table Expressions) documentation"
  [PSQL]: https://www.postgresql.org/docs/9.5/static/app-psql.html "PostgreSQL interactive terminal (psql) documentation"
  [PostgreSQL INSERT]: https://www.postgresql.org/docs/current/static/sql-insert.html "INSERT documentation"
