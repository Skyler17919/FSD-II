# JWT Authentication & Session Management — Full Stack Demo

Implements the experiment: token-based login, stateless session verification,
client-side token storage, and token attachment to requests.

## Structure
```
jwt-auth-demo/
├── backend/          Express + JWT API (real server, tested)
│   ├── server.js
│   └── package.json
└── frontend/         React app (no build step needed)
    └── index.html
```

## Run it

**1. Start the backend**
```bash
cd backend
npm install
npm start
```
Server runs at `http://localhost:5000`.

**2. Open the frontend**
Just open `frontend/index.html` directly in a browser (double-click it, or
`open frontend/index.html`). It's a self-contained React app loaded via CDN
(React, ReactDOM, Babel) — no `npm install` or bundler required for it.

Register a user, then log in. You'll see:
- the decoded JWT (header / payload / signature) rendered live
- the access token's remaining lifetime counting down
- a request log showing each API call, including the automatic
  refresh-token exchange when the 15-minute access token expires
- logout, which revokes the refresh token server-side

## What each backend route does

| Route | Method | Purpose |
|---|---|---|
| `/api/register` | POST | Create a user; password hashed with bcrypt before storage |
| `/api/login` | POST | Verify credentials, issue a signed **access token** (15 min) and **refresh token** (7 days) |
| `/api/profile` | GET | Protected route — requires `Authorization: Bearer <accessToken>`; verifies signature + expiry, no DB/session lookup (stateless) |
| `/api/refresh` | POST | Exchange a still-valid refresh token for a new access token, without re-entering credentials |
| `/api/logout` | POST | Revoke the refresh token server-side (removed from the valid-token store) |

## Security notes worth including in your lab write-up

- **Passwords** are never stored in plaintext — `bcrypt.hash()` with a salt round of 10.
- **Two-token pattern**: a short-lived access token limits the damage window if it
  leaks (e.g. via XSS), while a longer-lived refresh token lets the session
  continue without forcing frequent re-logins. This is the standard mitigation
  for JWT's core weakness: tokens can't be revoked individually before they expire,
  only refresh tokens (kept server-side in a revocation store) can be.
- **Stateless verification**: `/api/profile` never touches the "database" of
  users to check who's logged in — it only checks the token's cryptographic
  signature against the server's secret. This is what makes JWT auth scale
  horizontally across multiple servers without shared session storage.
- **Decoding vs verifying**: the frontend decodes the JWT payload purely for
  display (JWTs are base64, not encrypted — anyone can read the payload).
  That decoding proves nothing about authenticity; only the server, which
  holds `ACCESS_TOKEN_SECRET`, can verify the signature and should be trusted
  to authorize actions.
- **Storage tradeoff**: this demo stores tokens in `localStorage` for
  simplicity (matches the experiment's procedure). In production, an
  httpOnly cookie is generally safer for the refresh token since JS
  (and therefore XSS payloads) cannot read it.
- Replace the hardcoded dev secrets in `server.js` with environment
  variables before this ever goes near production.

## Expected outcome (mapped to the experiment brief)

- ✅ User login system implemented (register + login forms, validated against a hashed-password store)
- ✅ Token-based session handling achieved (access + refresh JWTs, decoded and visualized client-side)
- ✅ Stateless authentication flow demonstrated (`/api/profile` authorizes purely via signature verification, no server-side session store)
