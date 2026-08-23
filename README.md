# Ledger — AI Study Assistant Backend

This tiny Express server sits between your website and a free, locally-run
AI model (via [Ollama](https://ollama.com)) so that:

- No API key ever lives in frontend JavaScript.
- The AI provider can be swapped later (see `providers/`) without touching
  the website code.

```
Student → index.html chat UI → this server (/api/chat) → Ollama → reply
```

## 1. Install Ollama and pull a free model

1. Download Ollama for your OS: https://ollama.com/download
2. Install it, then in a terminal pull a model (one-time download):
   ```bash
   ollama pull llama3.1
   ```
   Smaller/faster alternative if your machine is limited: `ollama pull phi3`.
3. Ollama serves itself automatically after install (or run `ollama serve`).
   By default it listens on `http://localhost:11434` — you don't need to do
   anything else with it.

## 2. Configure and install the backend

```bash
cd backend
cp .env.example .env
npm install
```

Open `.env` and check:
- `AI_PROVIDER=ollama`
- `OLLAMA_MODEL=llama3.1` (must match the model you pulled)

## 3. Run the backend

```bash
npm start
```

You should see:
```
🎓 Ledger AI Study Assistant backend running at http://localhost:3000
   Frontend also served from here: http://localhost:3000/index.html
   AI provider: ollama
```

## 4. Open the website

The backend also serves your existing `index.html`, `style.css`, and
`script.js` directly (they live one folder above `backend/`), so the
simplest way to run everything with **zero CORS setup** is:

Open **http://localhost:3000** in your browser.

Alternative: if you prefer to keep serving the frontend a different way
(e.g. VS Code "Live Server" on port 5500), that also works — just make sure
its origin is listed in `ALLOWED_ORIGINS` in `.env`. The frontend's
`AI_CONFIG.apiBaseUrl` in `script.js` already points at
`http://localhost:3000`, so as long as the backend is running there, it
will be reachable either way.

## 5. Test it

1. Click the floating 🤖 chat button (bottom-right).
2. The status dot should turn green with "Online · ollama:llama3.1" within
   a second or two — that's the `/api/health` check succeeding.
3. Try a quick action, e.g. click **📚 Explain Topic**, finish the sentence
   ("...Newton's second law"), and press Enter.
4. You should see the typing indicator, then a real answer from your local
   model.
5. Try **🗑️ Clear Chat**, the copy button on a reply, and asking a
   follow-up question ("can you give a simpler example?") to confirm
   context is preserved.
6. To test error handling, stop the backend (`Ctrl+C`) and send a message —
   you should see a friendly inline error, not a broken UI.

### Testing without installing Ollama at all

Set `AI_PROVIDER=mock` in `.env` and restart (`npm start`). The chat will
respond with canned placeholder text instantly, which is enough to verify
the whole UI (bubbles, typing animation, copy, clear, quick actions, error
states) works before you set up a real model.

## Swapping in a different AI provider later

Every provider module in `providers/` exports the same shape:

```js
async function chat(messages) { /* ... */ return "reply text"; }
module.exports = { chat, name: 'my-provider' };
```

To add one:
1. Create `providers/my-provider.js` following that contract.
2. Register it in `providers/index.js`'s `providers` object.
3. Set `AI_PROVIDER=my-provider` in `.env`.

No changes to `server.js` or the frontend are needed. If you ever move to a
paid API (OpenAI, Anthropic, etc.), put the API key in `.env` (never in
`script.js`) and read it with `process.env.YOUR_KEY` inside the new
provider file only.

## Endpoints

| Method | Path          | Body                                   | Response                          |
|--------|---------------|-----------------------------------------|------------------------------------|
| GET    | `/api/health` | —                                       | `{ ok: true, provider: "..." }`    |
| POST   | `/api/chat`   | `{ message: string, history: [...] }`   | `{ reply: string }` or `{ error }` |
