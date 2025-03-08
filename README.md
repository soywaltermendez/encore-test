# Encore Test Project

This is a multi-service application built with Encore.ts, featuring several microservices that work together.

## Prerequisites 

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

## Services Overview

This application consists of the following services:

### 1. Hello Service
A simple greeting service that responds with a personalized "Hello" message.

**Endpoints:**
- `GET /hello/:name` - Returns a greeting with the provided name

**Example:**
```bash
curl http://localhost:4001/hello/World
```

### 2. Goodbye Service
A farewell service that responds with customizable goodbye messages.

**Endpoints:**
- `GET /goodbye/:name` - Returns a goodbye message with the provided name
- `GET /goodbye?name=<name>&message=<message>` - Returns a customized goodbye message

**Example:**
```bash
curl http://localhost:4001/goodbye/World
curl "http://localhost:4001/goodbye?name=World&message=Hasta%20la%20vista"
```

### 3. Items Service
A service for managing items in a database.

**Endpoints:**
- `POST /create-item` - Creates a new item
- `GET /items` - Lists all items
- `PUT /items/:id/done` - Marks an item as done

**Example:**
```bash
# Create an item
curl -X POST -H "Content-Type: application/json" -d '{"title":"Buy milk"}' http://localhost:4001/create-item

# List all items
curl http://localhost:4001/items

# Mark an item as done
curl -X PUT http://localhost:4001/items/1/done
```

### 4. User Service
A service for managing users with pub/sub integration.

**Endpoints:**
- `POST /user` - Creates a new user
- `GET /user/:id` - Gets a specific user
- `GET /users` - Lists all users

**Example:**
```bash
# Create a user
curl -X POST -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com"}' http://localhost:4001/user

# Get a user
curl http://localhost:4001/user/1

# List all users
curl http://localhost:4001/users
```

### 5. Email Service
A service that listens for user creation events and simulates sending welcome emails.

This service doesn't expose any public endpoints but subscribes to the `user-added` topic to process user creation events.

## Running the Application

Run this command from your application's root folder:

```bash
encore run --port=4001
```

## Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

Here you can see traces for all requests that you made, see your architecture diagram, and view API documentation in the Service Catalog.

## Development

### Add a new service

To create a new microservice, add a file named encore.service.ts in a new directory.
The file should export a service definition by calling `new Service`, imported from `encore.dev/service`.

```ts
import { Service } from "encore.dev/service";

export default new Service("my-service");
```

Encore will now consider this directory and all its subdirectories as part of the service.

Learn more in the docs: https://encore.dev/docs/ts/primitives/services

### Add a new endpoint

Create a new `.ts` file in your new service directory and write a regular async function within it. Then to turn it into an API endpoint, use the `api` function from the `encore.dev/api` module. This function designates it as an API endpoint.

Learn more in the docs: https://encore.dev/docs/ts/primitives/defining-apis

### Service-to-service API calls

Calling API endpoints between services looks like regular function calls with Encore.ts.
The only thing you need to do is import the service you want to call from `~encore/clients` and then call its API endpoints like functions.

In the example below, we import the service `hello` and call the `get` endpoint using a function call to `hello.get`:

```ts
import { hello } from "~encore/clients"; // import 'hello' service

export const myOtherAPI = api({}, async (): Promise<void> => {
  const resp = await hello.get({ name: "World" });
  console.log(resp.message); // "Hello World!"
});
```

Learn more in the docs: https://encore.dev/docs/ts/primitives/api-calls

### Add a database

To create a database, import `encore.dev/storage/sqldb` and call `new SQLDatabase`, assigning the result to a top-level variable. For example:

```ts
import { SQLDatabase } from "encore.dev/storage/sqldb";

// Create the todo database and assign it to the "db" variable
const db = new SQLDatabase("todo", {
  migrations: "./migrations",
});
```

Then create a directory `migrations` inside the service directory and add a migration file `1_create_table.up.sql` to define the database schema. For example:

```sql
CREATE TABLE todo_item (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);
```

Once you've added a migration, restart your app with `encore run` to start up the database and apply the migration. Keep in mind that you need to have [Docker](https://docker.com) installed and running to start the database.

Learn more in the docs: https://encore.dev/docs/ts/primitives/databases

### Pub/Sub

This application demonstrates the use of Pub/Sub for event-driven communication between services. The User service publishes events when a new user is created, and the Email service subscribes to these events to send welcome emails.

```ts
// Publishing events
export const UserAddedTopic = new Topic<UserRequest>("user-added", {
  deliveryGuarantee: "at-least-once",
});

await UserAddedTopic.publish({ name, email });

// Subscribing to events
const _ = new Subscription(UserAddedTopic, "welcome-email", {
  handler: async (event) => {
    await send(event);
  },
});
```

Learn more in the docs: https://encore.dev/docs/ts/primitives/pubsub

### Learn more

There are many more features to explore in Encore.ts, for example:

- [Request Validation](https://encore.dev/docs/ts/primitives/validation)
- [Streaming APIs](https://encore.dev/docs/ts/primitives/streaming-apis)
- [Cron jobs](https://encore.dev/docs/ts/primitives/cron-jobs)
- [Object Storage](https://encore.dev/docs/ts/primitives/object-storage)
- [Secrets](https://encore.dev/docs/ts/primitives/secrets)
- [Authentication handlers](https://encore.dev/docs/ts/develop/auth)
- [Middleware](https://encore.dev/docs/ts/develop/middleware)

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/self-host/docker-build) for how to use `encore build docker` to create a Docker image and configure it.

### Encore Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

You can also open your app in the [Cloud Dashboard](https://app.encore.dev) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

## Testing

To run tests, configure the `test` command in your `package.json` to the test runner of your choice, and then use the command `encore test` from the CLI. The `encore test` command sets up all the necessary infrastructure in test mode before handing over to the test runner. [Learn more](https://encore.dev/docs/ts/develop/testing)

```bash
encore test
```
