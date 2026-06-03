# ProdCon Frontend

React frontend for the copied ProdCon backend.

## Run

```bash
npm install
npm run dev
```

The app runs on Vite, usually at:

```text
http://localhost:5179
```

By default, API calls go to:

```text
http://localhost:5000
```

To point the frontend somewhere else, create a `.env` file in this folder:

```text
VITE_API_BASE_URL=http://localhost:5000
```

## Screens

- Login and signup using `/auth/login` and `/auth/signup`
- Interview setup for product sense, strategy, and execution
- Session start using `/session/:sessiontype/:sessionlevel`
- Chat response flow using `/session/respond/:sessionId`
- Feedback display from backend evaluation scores
- Local interview history stored in browser localStorage
