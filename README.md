# Alganas Workspace

Alganas Workspace is a small archive app for my friend to keep his AI prompts and useful design links in one place.

The current UI lets you:

- Browse and search saved AI prompts
- Fill prompt variables inline and copy the final prompt
- Browse and search saved links
- Open add/edit dialogs for prompts and links

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui and Radix UI primitives
- tRPC
- Better Auth
- Drizzle ORM
- libSQL / SQLite

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Create your environment file

Copy `.env.example` to `.env` and set the values:

```env
BETTER_AUTH_SECRET="your-secret"
DATABASE_URL="file:./db.sqlite"
```

Notes:

- `BETTER_AUTH_SECRET` is optional in development, but required in production.
- The default database points to a local SQLite file in the project root.

### 3. Prepare the database

```bash
bun run db:push
```

This applies the Drizzle schema to the configured SQLite database.

### 4. Start the app

```bash
bun run dev
```