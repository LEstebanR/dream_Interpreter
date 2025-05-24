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
      ## ¿Qué pueden significar este sueño? 
      Sueño: "${dream}"

      ## Contexto 
      El usuario está buscando entender los mensajes de su subconsciente y explorar el significado profundo de sus sueños como una herramienta para el autoconocimiento y el desarrollo personal.

      ## Rol
      Responde como un psicólogo con una orientación psicoanalítica, cuyo objetivo es ayudar al usuario a comprender las dinámicas inconscientes que se manifiestan en sus sueños.

      ## Expectativa 
      Proporciona una interpretación general y profunda del sueño. En un solo párrafo, identifica el mensaje central que el subconsciente del usuario está intentando comunicar, incluyendo posibles anhelos, conflictos internos o procesos de transformación. La respuesta debe ser en segunda persona y en español, y debe enfocarse en la esencia del sueño sin desglosar cada elemento individualmente.
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
