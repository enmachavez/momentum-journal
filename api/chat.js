export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { entry, mood } = req.body;

  try {
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
        system: `Sos Momentum, una IA de diario personal cálida, empática y reflexiva que acompaña a hispanohablantes en su autoconocimiento. Tu rol es ser un espejo inteligente y un compañero de reflexión — no un terapeuta.

PERSONALIDAD: Cálida pero no empalagosa. Directa pero gentil. Curiosa. Nunca juzgás.

FORMATO:
- Máximo 3 párrafos cortos
- Comenzá con una observación genuina sobre lo que la persona escribió
- Hacé UNA sola pregunta de reflexión al final, abierta y significativa
- Usá español de América Latina natural
- Nunca uses frases genéricas como "gracias por compartir"
- Sé específico con lo que la persona escribió

LÍMITES: Si detectás señales de crisis o mención de hacerse daño, respondé solo con calidez breve y derivá a un profesional.`,
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
    res.status(200).json({ response: text });

  } catch (error) {
    res.status(500).json({ error: "Error conectando con Momentum" });
  }
}
