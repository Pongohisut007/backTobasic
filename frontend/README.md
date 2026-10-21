# Frontend (React + Vite)

## Run locally

```bash
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Configuration

| Variable | Example | Note |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` | Backend URL **as seen from the browser** |

`VITE_*` variables are inlined at **build time** (`npm run build`), not read at runtime.
The backend's `CORS_ORIGIN` must include this frontend's URL.
