# 🔐 Next.js JWT Auth Starter

A lightweight starter project for implementing a **simple, secure JWT authentication strategy** using modern tools and best practices.

## 🚀 Stack

- **Next.js** – App router & Actions
- **React** -  useActionState
- **JOSE** – JSON Web Token library for signing/validating JWTs
- **Drizzle ORM** – Type-safe PostgreSQL database layer
- **Zod** - Validation library
- **PostgreSQL** – User data storage
- **Argon2** – Secure password hashing
- **Docker** – Local containerized development environment

## 📦 Features

- JWT-based login and session strategy using HTTP-only cookies
- Secure password storage with Argon2
- Minimal and clear authentication flow
- Preconfigured Docker setup for Postgres
- Modular and extensible codebase

## 📁 Structure
`
auth-jwt
| |-- src/
| | |-- app/
| | | |-- login/
| | |   |-- page.tsx # Login route
| | | |-- register/
| | |   |-- page.tsx # Register route
| | |-- page.tsx # Root route
| |
| | |-- db/
| | |-- index.ts 
| | |-- schema.ts 
| | |-- types.ts # Table types
| | |-- use-cases/
| | | |-- add-user.ts # Inserting user into db
| | | |-- get-user.ts # Querying user from db
| |
| | |-- lib/
| | |-- utils.ts 
| | |-- actions.ts # Auth actions
| | |-- jwt-strategy.ts # Encryption & decryption
| |
| | |-- components/
| | | |-- ui/ # Minimal UI components mostly from Shadcn
| | |-- user-button.tsx # Provides logout 
| |
| |-- env.ts
| |-- middleware.ts
|-- drizzle.config.ts 
|-- compose.yml
|-- .env
`
## 🔧 Setup

1. **Clone and install dependencies**

```bash
git clone https://github.com/FranciscoAVD/auth-jwt
cd auth-jwt
bun install
```

2. **Define environment variables**
 
- `DATABASE_URL=postgres://postgres:password@localhost:5432/postgres`
- `PEPPER` & `SESSION_SECRET` will be equal to the outputs of
```bash
openssl rand -base64 32
```

- `SESSION_NAME=auth_token` (can be any name)
- `NODE_ENV=development`

3. **Build container**
- `docker compose up`
- `docker compose up -d` (If you would prefer to have the container run in the background)

4. **Push schema to db**

- `bun run db:push`
-  `bun run db:studio` (optionally)

## 📝 License
MIT
