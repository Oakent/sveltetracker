# SvelteTracker

SvelteTracker is a SvelteKit application for tracking language-learning input across different kinds of content. It supports multi-language profiles, a central content log, and media-specific flows for TV, movies, podcasts, and manual entries.

## Live deployment

The project is currently deployed on Vercel:

[https://sveltetracker.vercel.app/](https://sveltetracker.vercel.app/)

---

## What this repository uses

The project uses:

- **SvelteKit** for the web application
- **Prisma** for database access
- **PostgreSQL** for local development data
- **Docker Compose** to run the local database
- **Make** to simplify local setup and day-to-day development
- **Supabase** for the real authentication flow in non-bypass environments

For local development, the repository also supports a **development auth bypass** so contributors can get the app running without first provisioning a full Supabase project.

---

## Quick start

If you just want to get the project running locally with the least amount of setup:

```sh
git clone https://github.com/Oakent/sveltetracker.git
cd sveltetracker
make up
```

That command will:

1. create a local `.env` from `.env.example` if one does not already exist
2. start the local PostgreSQL container with Docker
3. install npm dependencies
4. generate the Prisma client
5. apply database migrations
6. seed the local development user/profile if configured
7. start the SvelteKit development server

For most contributors, this is the recommended way to start.

---

## Requirements

Before running the project locally, make sure you have the following installed:

- **Node.js 20 or newer**
- **npm**
- **Docker**
- **GNU Make**

You can verify your versions with:

```sh
node -v
npm -v
docker -v
make -v
```

### Important

Do **not** run the Make commands with `sudo`.

Use:

```sh
make up
```

not:

```sh
sudo make up
```

Running the project with `sudo` can cause dependency installs, cache files, and generated files to be owned by root, which will create avoidable problems later.

---

## Local development workflow

### Recommended

Start everything with:

```sh
make up
```

This is the main bootstrap command.

### Stop local services

```sh
make down
```

This stops the local Docker services started by the project.

### Reset the local environment

```sh
make reset
```

This removes:

- Docker containers
- Docker volumes
- `node_modules`
- the local `.env`

Use this if you want to start again from a clean state.

### Start the app only

```sh
make dev
```

This starts the SvelteKit development server only.

This **does not**:

- create `.env`
- start PostgreSQL
- install dependencies
- run Prisma generate
- apply migrations
- seed local development data

Use `make dev` only if you already know your local environment is prepared.

### Run migration-related setup manually

```sh
make migrate
```

### View database logs

```sh
make logs
```

### Validate the project

```sh
make check
```

---

## Understanding `make up` vs `make dev`

This is the part that matters most if you are new to the repository.

### `make up`

`make up` is the **bootstrap command**.

It prepares the local environment and then starts the app.

Use this when:

- you are setting the project up for the first time
- you have just cloned the repository
- you have reset the repo
- your local database is not running
- your `.env` file does not exist yet
- you want the least amount of manual setup

### `make dev`

`make dev` is **not** the same as `make up`.

It only starts the development server.

It assumes that:

- your `.env` file already exists
- your database is already running
- dependencies are already installed
- Prisma has already been generated
- migrations have already been applied

If you run `make dev` before the environment has been prepared, the app may fail to start or may start in a broken state.

### In practice

Use this:

```sh
make up
```

If the project is not already prepared.

Use this:

```sh
make dev
```

Only after `make up` has already been run successfully and you are simply restarting the frontend dev server.

---

## Environment files

The repository includes an `.env.example` file.

On first bootstrap, `make up` will automatically create `.env` from `.env.example` if `.env` does not already exist.

### Why this matters

The application depends on environment variables for:

- database connections
- Supabase auth integration
- optional media enrichment APIs
- local development behavior

If `.env` is missing or incorrect, the app may compile but fail when certain features are used.

---

## Local development auth bypass

For local development, the project can run with a development auth bypass enabled.

This means a contributor can get into the app locally without setting up the full real authentication flow first.

### What this changes locally

With development bypass enabled:

- the app behaves as though a local development user is already authenticated
- protected app routes can be accessed without real login
- local development is faster and simpler for contributors

### What this does **not** mean

It does **not** mean real authentication is working locally.

It also does **not** mean production auth has been replaced.

It is only a convenience for local development.

### Why this is useful

Without the bypass, every contributor would need to:

- create and configure a Supabase project
- supply valid auth environment variables
- confirm the auth callback flow is wired correctly
- provision user data before being able to inspect the application

That is too much friction for basic local development.

### Important note

If you are testing the real login flow, you should **not** use the auth bypass configuration.

---

## Real authentication / Supabase setup

The production-style auth flow depends on Supabase.

If you want to run the app against a real auth setup rather than the local bypass, you will need valid values for at least:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

Depending on the features you want to test, you may also need:

- `TMDB_API_KEY`
- `PODCAST_INDEX_KEY`
- `PODCAST_INDEX_SECRET`

If these values are missing, features that depend on external services may fail or return incomplete results.

---

## Manual development flow

If you do not want to use the Makefile workflow, you can still run everything manually.

### 1. Install dependencies

```sh
npm install
```

### 2. Create your environment file

```sh
cp .env.example .env
```

Then edit `.env` as needed.

### 3. Start the local database

```sh
docker compose up -d db
```

### 4. Generate Prisma client

```sh
npx prisma generate
```

### 5. Apply migrations

```sh
npx prisma migrate deploy
```

If needed during development, use:

```sh
npx prisma migrate dev
```

### 6. Start the app

```sh
npm run dev
```

Or:

```sh
npm run dev -- --open
```

---

## Day-to-day development examples

### First run on a fresh clone

```sh
make up
```

### Stop the app and come back later

If the database is still fine and your environment is already prepared, you will usually only need:

```sh
make dev
```

If you are unsure, just run:

```sh
make up
```

again.

### Rebuild after cleaning everything

```sh
make reset
make up
```

### Only want to inspect database logs

```sh
make logs
```

---

## Common issues

### `make: *** No rule to make target 'up'. Stop.`

You do not yet have the project Makefile in place, or you are not in the repository root.

Check:

```sh
pwd
ls
```

You should be in the repository root and able to see `Makefile`.

---

### `npm ERR! engine Unsupported engine`

Your Node version is too old for the project.

Check:

```sh
node -v
npm -v
```

This project expects **Node.js 20+**.

---

### Docker starts, but the app still fails

That usually means one of the following:

- `.env` is missing or incorrect
- Prisma client has not been generated
- migrations have not been applied
- the database container is up, but the schema is not ready
- you used `make dev` before running `make up`

In most cases, run:

```sh
make up
```

If the environment has become messy, run:

```sh
make reset
make up
```

---

### Login behaves differently locally

That is expected if the development auth bypass is enabled.

Local bypass mode is for contributor convenience. It is not the same as exercising the real Supabase authentication flow.

---

### I changed `.env`, but the app is still behaving strangely

Restart the dev server after changing environment variables.

If the issue appears database-related, also restart the local services.

A safe sequence is:

```sh
make down
make up
```

---

### I used `sudo make up`

Fix file ownership before continuing.

If root-owned files were created in the repo, you may need to correct permissions before running the project normally again.

Avoid using `sudo` for the development workflow unless you specifically know why you need it.

---

## Building for production

To create a production build:

```sh
npm run build
```

To preview the production build locally:

```sh
npm run preview
```

---

## Deployment notes

The project is currently deployed on Vercel.

Depending on the deployment target, you may need to configure the appropriate SvelteKit adapter and production environment variables.

For more information, see the SvelteKit adapter documentation:

[https://svelte.dev/docs/kit/adapters](https://svelte.dev/docs/kit/adapters)

---

## Contributor notes

The goal of the local bootstrap workflow is simple:

A contributor should be able to clone the repository, run a single command, and start exploring or building without first having to manually wire together half the stack.

If you are contributing to the project and do not specifically need a custom setup, prefer the Make-based workflow.