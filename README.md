// ── Claude AI Safety Assistant ─────────────────────────────────
// Add your Anthropic API key below.
// For production, route through a Firebase Cloud Function instead.
const ANTHROPIC_API_KEY = 'YOUR_API_KEY_HERE'; // sk-ant-...

const SAFETY_SYSTEM_PROMPT = `You are Suraksha AI — a compassionate, expert women's safety assistant built into the Suraksha app used in India.
Provide calm, clear, actionable safety guidance. Give numbered steps. Share emergency numbers when relevant (Police:100, Ambulance:108, Emergency:112, Women's Helpline:1091).
Keep responses under 200 words. Use occasional emojis for warmth. Only handle safety topics.`;

export async function callClaudeAI(history) {
  const messages = history
    .filter(m => m.role === 'user' || m.role === 'bot')
    .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }));
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SAFETY_SYSTEM_PROMPT,
        messages,
      }),
    });
    if (!res.ok) throw new Error('API ' + res.status);
    const data = await res.json();
    return data.content?.[0]?.text || getLocalAI(messages.at(-1)?.content || '');
  } catch {
    return getLocalAI(messages.at(-1)?.content || '');
  }
}

export function getLocalAI(msg) {
  const m = msg.toLowerCase();
  if (m.includes('follow') || m.includes('stalker'))
    return "⚠️ If you're being followed:\n\n1. Do NOT go home directly\n2. Enter the nearest store or public place\n3. Call someone and stay on the line\n4. Note their description (clothing, vehicle)\n5. Call 112 if threat continues\n6. Share your live location via Suraksha now\n\nYou are not alone. Stay in public.";
  if (m.includes('harass') || m.includes('assault') || m.includes('attack'))
    return "🚨 Immediate steps:\n\n1. Move toward crowded, well-lit areas NOW\n2. Shout loudly — attract attention\n3. Activate Suraksha SOS to alert contacts\n4. Call 112 or 1091 (Women's Helpline)\n5. Record audio using Voice Recorder\n\nWhat's happening is not your fault. Help is coming.";
  if (m.includes('unsafe') || m.includes('scared') || m.includes('afraid'))
    return "I hear you — your feelings are valid 💙\n\n1. Move to a populated, lit area\n2. Call someone from Emergency Contacts\n3. Activate SOS if situation escalates\n4. Keep phone in hand, earphones out\n5. Trust your instincts — they protect you\n\nOne step at a time. You've got this.";
  if (m.includes('route') || m.includes('home') || m.includes('walk') || m.includes('night'))
    return "🌙 Night safety checklist:\n\n1. Share live location before leaving\n2. Use well-lit, busy streets — avoid shortcuts\n3. Stay on a call with someone\n4. Keep phone charged and accessible\n5. Use Suraksha Safe Route for AI-verified paths\n6. Tell someone your ETA";
  if (m.includes('helpline') || m.includes('number') || m.includes('police'))
    return "📞 Emergency Numbers — India:\n\n🚔 Police: 100\n🚑 Ambulance: 108\n📞 National Emergency: 112\n👩 Women's Helpline: 1091\n🏠 Domestic Violence: 181\n🧠 iCall: 9152987821\n\nSave these on speed dial. Suraksha SOS alerts your personal contacts too.";
  if (m.includes('hello') || m.includes('hi') || m.length < 5)
    return "Hello! I'm Suraksha AI 🛡️\n\nI provide expert safety guidance powered by Claude. Ask me about:\n• Being followed or feeling unsafe\n• Harassment or assault\n• Safe routes and night travel\n• Emergency helplines\n• How to use Suraksha features\n\nWhat can I help you with today?";
  return "I'm here to help with your safety 💙\n\nTell me more about your situation and I'll give specific guidance. I can help with:\n• Immediate threats or danger\n• Harassment or stalking\n• Safe travel planning\n• Emergency resources\n\nYour safety is the priority.";
}
