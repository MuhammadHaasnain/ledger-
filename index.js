/**
 * Provider registry.
 *
 * This is the ONE place that decides which AI backend is actually used.
 * Adding a new provider later (e.g. an OpenAI-compatible API, LM Studio,
 * a paid service) means: create providers/newthing.js exporting the same
 * `chat(messages)` contract, register it below, then set
 * AI_PROVIDER=newthing in .env. server.js and the frontend never change.
 */

const providers = {
  ollama: require('./ollama'),
  mock: require('./mock'),
};

function getProvider() {
  const key = (process.env.AI_PROVIDER || 'ollama').toLowerCase();
  const provider = providers[key];
  if (!provider) {
    const available = Object.keys(providers).join(', ');
    throw new Error(`Unknown AI_PROVIDER "${key}". Available providers: ${available}`);
  }
  return provider;
}

module.exports = { getProvider };
