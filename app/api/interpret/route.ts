import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { dream } = await req.json();

    if (!dream) {
      return NextResponse.json(
        { error: "Se requiere un sueño para interpretar" },
        { status: 400 }
      );
    }

    const prompt = `
        Eres un experto en interpretación de sueños. Analiza el siguiente sueño y proporciona una interpretación 
        detallada pero concisa (1 párrafo). Incluye posibles significados simbólicos, 
        conexiones con la vida del soñador y sugerencias sobre qué podría estar procesando su subconsciente. Habla en segunda persona. responde en español.
        
        Sueño: "${dream}"
        
        Interpretación:
      `;

    if (!process.env.OPENROUTER_API_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error("Missing required environment variables");
    }

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
      "X-Title": "Dream Interpreter",
    });

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-8b-instruct:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al generar la interpretación");
    }

    const data = await response.json();
    return NextResponse.json({
      interpretation: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error en la interpretación:", error);
    return NextResponse.json(
      { error: "Error al procesar la interpretación del sueño" },
      { status: 500 }
    );
  }
}
