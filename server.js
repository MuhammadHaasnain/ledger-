/**
 * Ledger AI Study Assistant — backend server.
 *
 * Architecture:
 *   Student → Website Chat UI (script.js) → THIS SERVER → AI Model → Response
 *
 * The frontend never talks to an AI provider directly and never holds any
 * credentials. It only calls the two small endpoints below. Which AI model
 * actually answers is decided entirely on this side (see providers/index.js
 * and the AI_PROVIDER setting in .env), so the provider can be changed
 * later without touching a single line of frontend code.
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { getProvider } = require('./providers');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------------------------------------------------------------------- *
 * The personality/behavior of the tutor lives here, server-side, so it's
 * applied consistently no matter what the student types and can't be
 * overridden from the browser.
 * ---------------------------------------------------------------------- */
const SYSTEM_PROMPT = `You are an expert AI Study Assistant for students.
Explain concepts clearly and simply. Adapt explanations to the student's level.
Use examples, formulas, bullet points, and step-by-step reasoning when useful.
Encourage students to understand concepts instead of blindly copying answers.
If a question is unclear, ask for clarification. Be supportive, accurate, and educational.
Keep responses focused and well-organized — use short paragraphs, numbered steps for
problems, and bullet points for lists of facts or notes.`;

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 20;

/* ---------------------------------------------------------------------- *
 * Middleware
 * ---------------------------------------------------------------------- */
app.use(express.json({ limit: '256kb' }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header (curl, same-origin requests when we serve the
      // frontend ourselves below, some mobile webviews) — allow it.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
  })
);

// Serve the existing frontend (index.html / style.css / script.js) straight
// from this same server. This is the easiest way to run everything with one
// command and sidesteps CORS entirely, since frontend and backend then share
// an origin. Visit http://localhost:3000 to use the app this way.
app.use(express.static(path.join(__dirname, '..')));

/* ---------------------------------------------------------------------- *
 * Routes
 * ---------------------------------------------------------------------- */

// Simple liveness/config check the frontend polls when the chat opens, so
// the status dot can say "Backend offline" instead of failing silently.
app.get('/api/health', (req, res) => {
  let provider;
  try {
    provider = getProvider();
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
  res.json({ ok: true, provider: provider.name });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body || {};

    // ---- Validate input --------------------------------------------------
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A non-empty "message" string is required.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`,
      });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (m) =>
              m &&
              (m.role === 'user' || m.role === 'assistant') &&
              typeof m.content === 'string'
          )
          .slice(-MAX_HISTORY_ITEMS)
          .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))
      : [];

    // ---- Build the conversation for the model -----------------------------
    // The system prompt always goes first and is never influenced by the
    // client. History gives the model conversational context for follow-up
    // questions ("explain that step again", "make it shorter", etc).
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...safeHistory,
      { role: 'user', content: message.trim() },
    ];

    const provider = getProvider();
    const reply = await provider.chat(messages);

    res.json({ reply });
  } catch (err) {
    console.error('[/api/chat] error:', err.message);
    // Give the frontend a message it can show directly to the student,
    // without leaking stack traces or internal details.
    res.status(502).json({
      error:
        err.message && err.message.length < 200
          ? err.message
          : 'The AI Study Assistant is temporarily unavailable. Please try again.',
    });
  }
});

// Fallback for unknown API routes.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Unknown API endpoint.' });
});

app.listen(PORT, () => {
  console.log(`\n🎓 Ledger AI Study Assistant backend running at http://localhost:${PORT}`);
  console.log(`   Frontend also served from here: http://localhost:${PORT}/index.html`);
  console.log(`   AI provider: ${process.env.AI_PROVIDER || 'ollama'}\n`);
});
