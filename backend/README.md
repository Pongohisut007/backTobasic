# Backend (NestJS)

REST API for todos, backed by PostgreSQL.

## Run locally

```bash
cp .env.example .env     # adjust DB settings if needed
npm install
npm run start:dev        # http://localhost:3000/api
```

Needs a running PostgreSQL, e.g.:

```bash
docker run -d --name pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=todos -p 5432:5432 postgres:17-alpine
```

## Endpoints (prefix `/api`)

| Method | Path | Description |
|---|---|---|
| GET | `/health/live` | Liveness — process is up |
| GET | `/health/ready` | Readiness — database is reachable |
| GET | `/info` | Pod hostname, version, environment |
| GET | `/todos` | List todos |
| POST | `/todos` | Create `{ "title": "..." }` |
| PATCH | `/todos/:id` | Update `{ "title"?, "completed"? }` |
| DELETE | `/todos/:id` | Delete |

## Environment variables

See `.env.example`. `DB_PASSWORD` is the one that belongs in a Secret.
