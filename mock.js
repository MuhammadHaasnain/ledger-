/**
 * Mock provider — no AI model required at all.
 *
 * Useful for:
 *   - Testing the chat UI (typing indicator, bubbles, copy, clear, errors)
 *     before Ollama is installed.
 *   - CI / demos on a machine that can't run a local model.
 *
 * Set AI_PROVIDER=mock in backend/.env to use this instead of Ollama.
 */

async function chat(messages) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const question = lastUser ? lastUser.content : 'your question';

  // Tiny artificial delay so the typing indicator is visible during testing.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return (
    `(Mock AI Study Assistant — no real model connected yet)\n\n` +
    `I received your message: "${question}"\n\n` +
    `Once you set AI_PROVIDER=ollama in backend/.env and have Ollama running ` +
    `with a model pulled, I'll give you a real, helpful answer here instead.`
  );
}

module.exports = { chat, name: 'mock' };
