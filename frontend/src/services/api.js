/**
 * Frontend API client connecting to backend Qwen API
 */

export const AVAILABLE_MODELS = [
  { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Qwen 2.5 72B Instruct (Free)', provider: 'OpenRouter' },
  { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder 32B (Free)', provider: 'OpenRouter' },
  { id: 'qwen/qwen-2-7b-instruct:free', name: 'Qwen 2 7B Instruct (Free)', provider: 'OpenRouter' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct (Free)', provider: 'OpenRouter' },
  { id: 'pollinations-qwen', name: 'Qwen 2.5 via Public Gateway (Zero Key)', provider: 'Public Gateway' }
];

export async function requestLegalProcedure({ query, category, apiKey, model }) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        category,
        apiKey,
        model
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        return {
          text: data.data.content,
          modelUsed: data.data.modelUsed,
          provider: data.data.provider || 'Backend API'
        };
      }
    }
  } catch (backendError) {
    console.warn('Backend server unavailable, attempting direct fallback...', backendError);
  }

  // Fallback: Direct public gateway if backend is offline
  const publicUrl = 'https://text.pollinations.ai/';
  const domain = category === 'industrial' ? 'Industrial Law' : 'Personal Law';
  const prompt = `You are LegalLens AI, expert procedural legal assistant for ${domain}.
Generate a structured Markdown procedural roadmap with:
1. ### ⚖️ Overview & Statutory Framework
2. ### 📋 Step-by-Step Procedural Roadmap
3. ### 📑 Essential Documentation Checklist
4. ### ⏱️ Estimated Timeline & Limitation Period
5. ### ⚠️ Critical Precautions & Pitfalls

Query: ${query}`;

  const res = await fetch(publicUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai'
    })
  });

  if (res.ok) {
    const text = await res.text();
    return {
      text,
      modelUsed: 'Qwen 2.5 (Public AI Gateway)',
      provider: 'Free Public AI'
    };
  }

  throw new Error('Could not generate response from backend or fallback.');
}
