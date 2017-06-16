---
aliases:
  - /cross-database-querying-in-postgresql/
date: "2017-06-10"
description: "PostgreSQL has a really useful extension which allows cross-database queries."
slug: "cross-database-querying-in-postgresql"
tags: ["programming", "personal development"]
title: "Cross Database Querying in PostgreSQL"
---


![Good And Evil Sketch][]


I’ve been using [PostgreSQL][] for the past few months. I figured I’d take a moment to walk you through setting up your database to enable you take advantage of this cool feature, that you may find interesting (if you’re not already using it).

**NOTE**: I use [Amazon RDS for PostgreSQL][] instances – so these instructions will work for you if you’re using same. However, if you’re not, it might still work but this will depend on your server setup.


## PostgreSQL Cross Database Querying

The question is: _How can you make PostgreSQL support cross database querying?_ The answer is pretty simple: **postgres_fdw**.

[postgres_fdw][] extension is essentially a PostgreSQL-to-PostgreSQL connector for PostgreSQL databases, which may be the same or different hosts.

The extension ships with PostgreSQL and permits you to query, update, insert, or delete data in one PostgreSQL database from a different one. To use this, you'll need to activate this once on your database.

To activate it, just run:

```sql
CREATE EXTENSION postgres_fdw
```

On your PostgreSQL server – will you now have cross database capabilities? Unfortunately, not quite so as you need to set up the server connection and create user mappings.


### Server Connection

Now, run the `CREATE SERVER` command as **admin user** to set up the connection to the foreign database and provide the **host**, **dbname** and **port** information even if the database where you installed the foreign data wrapper is on the same host as the database you're connecting to:

```sql
CREATE SERVER <server_connection_name>
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host '<host_address>', dbname '<database_name>', port '<port_number>');
```


### User Mapping

Mapping should be created for a user with permissions in the current database (just use admin user), however the **user** and **password** needs to have the required permissions for the foreign database.

Here's what it looks like:

```sql
CREATE USER MAPPING FOR admin
SERVER <server_connection_name>
OPTIONS (user '<foreign_database_user>', password '<foreign_database_password>');
```


### Import Data

With the server connection set up, the next step is importing the data. You can import the schema containing all the tables and views, or limit to just a few specified.

To import the schema use `IMPORT FOREIGN SCHEMA`, like this:

```sql
IMPORT FOREIGN SCHEMA <foreign_schema_name>
LIMIT TO (<foreign_table_name>)
FROM SERVER <server_connection_name> INTO public;
```

This time, you're importing a foreign schema from the foreign database, limiting the import to just the table you're most interested in (`<foreign_table_name>`), and importing into your current schema, which is the **"public"** schema.

**NOTE**:

- `LIMIT TO` clause allows you to specify only the tables or views you want from the schema. If you don't specify, all the tables and views from the schema will be imported.
- `IMPORT FOREIGN SCHEMA`  synchronizes changes automatically if the table structure changes in the foreign database (such as a new column added or dropped).


### Verify Setup

It can be difficult to remember what server connections you've created and what tables are available. To remind yourself, there are different system catalogs you can query from, including **pg_foreign_server** for servers and **pg_foreign_table** for tables.

Here's the server connections you've created:

```sql
SELECT * FROM pg_foreign_server;

srvname | srvowner | srvfdw | srvtype | srvversion | srvacl | srvoptions
--------------------------------------------------------------------------------------------------------------------------------------
<server_connection_name> | 16384    | 16399  |         |            |        | {host=<host_address>,dbname=<database_name>,port=<port_number>}
```

The `srvowner` and `srvfdw` columns for the server contain the internal object ID reference for the admin user as owner and the postgres_fdw extension as the fdw. The `srvtype`, `srvversion`, and `srvacl` columns are NULL because you did not specify those parameters when you created the server connection, though you can specify if needed.

Here's the tables available:

```sql
SELECT * FROM pg_foreign_table;

ftrelid | ftserver | ftoptions
----------------------------------------------------------------
16469   | 16464    | {schema_name=<foreign_schema_name>,table_name=<foreign_table_name>}
```

The table is from the same foreign server connection (16464, the internal object ID reference for the connection to the foreign database) and the table has its own relation ID (again, an internal object ID reference). If you at any point add other server connections and more tables, running these two queries will remind you.


### Query

Now that you have foreign tables, you can write queries to tie the data together from two databases to get richer reports. Here's an example query, selecting from the foreign database:

```sql
SELECT *
FROM <foreign_table_name>;
```

Trying to run a query like this without having the foreign data wrapper set up would yield a **"cross-database references are not implemented"** error. Luckily you don't need to worry about that anymore!


## Thoughts


![Thinking Android Sketch][]


Postgres foreign data wrapper is new to PostgreSQL, more SQL standard compliant compared to [dblink][], and provides improved performance over dblink connections, so it tends to be the recommended method.

The foreign data wrapper establishes a permanent connection, which could be advantageous or disruptive, depending on your needs. However, the drawback is that postgres_fdw will work on earlier PostgreSQL versions, which means you'll need to spin up a new PostgreSQL deployment in order to use postgres_fdw. In my experience, SQL queries takes way more time to execute, if you're joining more foreign tables.

Regardless of which method will work best for you, you can now query across your different PostgreSQL databases with ease.

Got any questions? Feel free to [shoot me an email][], would be happy to help.

  [Good And Evil Sketch]: /static/images/2017/good-and-evil-sketch.jpg "Good And Evil Sketch"
  [PostgreSQL]: http://postgresql.org "PostgreSQL Website"
  [Amazon RDS for PostgreSQL]: https://aws.amazon.com/rds/postgresql/ "Launch Amazon RDS, the relational database service that makes it easy to set up, operate, and scale PostgreSQL deployments in the cloud."
  [postgres_fdw]: http://www.postgresql.org/docs/9.5/static/postgres-fdw.html "postgres_fdw documentation"
  [dblink]: http://www.postgresql.org/docs/current/static/dblink.html "dblink documentation"
  [Thinking Android Sketch]: /static/images/2017/thinking-android-sketch.png "Thinking Android Sketch"
  [shoot me an email]: mailto:r@akinjide.me "Akinjide Bankole' Email"
