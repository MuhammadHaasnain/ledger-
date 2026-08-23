/**
 * Ollama provider.
 *
 * Talks to a locally running Ollama instance (https://ollama.com), which
 * runs open-source models entirely on the developer's own machine — no
 * API key, no per-token cost. This is the default provider for local
 * development, per the project's "keep it free" requirement.
 *
 * Every provider module in this folder exports the same shape:
 *   async function chat(messages) -> string
 * where `messages` is an array of { role: 'system'|'user'|'assistant', content }.
 * That shared contract is what lets server.js swap providers by changing
 * one environment variable, without any other code changing.
 */

const BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.1';

async function chat(messages) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: false,
        options: {
          // Keep answers focused rather than rambling — good for a tutor.
          temperature: 0.6,
        },
      }),
    });
  } catch (err) {
    // Ollama isn't running / wrong port / etc.
    throw new Error(
      `Could not reach Ollama at ${BASE_URL}. Is "ollama serve" running? (${err.message})`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    if (res.status === 404) {
      throw new Error(
        `Ollama model "${MODEL}" was not found. Run: ollama pull ${MODEL}`
      );
    }
    throw new Error(`Ollama request failed (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json();
  const content = data && data.message && data.message.content;
  if (!content) {
    throw new Error('Ollama returned an unexpected response shape.');
  }
  return content.trim();
}

module.exports = { chat, name: `ollama:${MODEL}` };
