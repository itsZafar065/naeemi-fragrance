# Naeemi Fragrance

Next.js storefront and PWA for Naeemi Fragrance.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local` and replace every placeholder with the correct value.

Never commit real secrets. `.env*` files are intentionally ignored by git.

## Secret Safety

All deployment secrets must live in environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `PUSHER_SECRET`
- `SMTP_PASS`

Only browser-safe values may use the `NEXT_PUBLIC_` prefix. In this project that is limited to the public app URL and Pusher client connection settings.

## Git History Warning

If any secret, password, token, API key, database URL, or credential was ever hardcoded or committed in the past, removing it from the latest code is not enough. The old value may still exist in git history, forks, logs, or deployments. Rotate any previously hardcoded secrets immediately before production deployment.

## Personal Data Flow

See `docs/personal-data-flow-audit.md` for the current map of collected user data, storage locations, third-party sharing, cookie/storage behavior, and deletion handling.

## Checks

```bash
npm run lint
npm run build
```
