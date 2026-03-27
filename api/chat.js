export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { entry, mood } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: `Sos Momentum, una IA de diario personal cálida y reflexiva para hispanohablantes. Sos un espejo inteligente — no un terapeuta. Respondé en máximo 3 párrafos cortos, con una observación genuina y una sola pregunta de reflexión al final. Usá español latinoamericano natural. Nunca uses frases genéricas como "gracias por compartir".`,
      messages: [
        {
          role: "user",
          content: `Entrada de diario${mood ? ` (estado de ánimo: ${mood})` : ''}:\n\n"${entry}"`
        }
      ]
    })
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || "Hubo un momento de silencio. ¿Querés intentarlo de nuevo?";

  return new Response(JSON.stringify({ response: text }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
