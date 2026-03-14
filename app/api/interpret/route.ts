import { NextResponse } from "next/server";

const FREE_MODELS = [
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "stepfun/step-3.5-flash:free",
  "arcee-ai/trinity-large-preview:free",
];

async function callOpenRouter(
  prompt: string,
  headers: Headers,
  modelIndex = 0
): Promise<string> {
  if (modelIndex >= FREE_MODELS.length) {
    throw new Error("No free models available");
  }

  const model = FREE_MODELS[modelIndex];
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 404) {
      console.warn(`Model ${model} not available, trying next...`);
      return callOpenRouter(prompt, headers, modelIndex + 1);
    }
    console.error("OpenRouter error:", response.status, errorBody);
    throw new Error(`OpenRouter ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

const prompts: Record<string, (dream: string) => string> = {
  es: (dream) => `
## ¿Qué pueden significar este sueño?
Sueño: "${dream}"

## Contexto
El usuario está buscando entender los mensajes de su subconsciente y explorar el significado profundo de sus sueños como una herramienta para el autoconocimiento y el desarrollo personal.

## Rol
Responde como un psicólogo con una orientación psicoanalítica, cuyo objetivo es ayudar al usuario a comprender las dinámicas inconscientes que se manifiestan en sus sueños.

## Expectativa
Proporciona una interpretación general y profunda del sueño. En un solo párrafo, identifica el mensaje central que el subconsciente del usuario está intentando comunicar, incluyendo posibles anhelos, conflictos internos o procesos de transformación. La respuesta debe ser en segunda persona y en español, y debe enfocarse en la esencia del sueño sin desglosar cada elemento individualmente.
  `,
  en: (dream) => `
## What might this dream mean?
Dream: "${dream}"

## Context
The user is seeking to understand the messages from their subconscious and explore the deep meaning of their dreams as a tool for self-knowledge and personal development.

## Role
Respond as a psychologist with a psychoanalytic orientation, whose goal is to help the user understand the unconscious dynamics that manifest in their dreams.

## Expectation
Provide a general and deep interpretation of the dream. In a single paragraph, identify the central message that the user's subconscious is trying to communicate, including possible longings, internal conflicts, or transformation processes. The response should be in second person and in English, and should focus on the essence of the dream without breaking down each element individually.
  `,
};

export async function POST(req: Request) {
  try {
    const { dream, locale } = await req.json();

    if (!dream) {
      return NextResponse.json(
        { error: "A dream is required for interpretation" },
        { status: 400 }
      );
    }

    const buildPrompt = prompts[locale] ?? prompts.es;
    const prompt = buildPrompt(dream);

    if (!process.env.OPENROUTER_API_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error("Missing required environment variables");
    }

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
      "X-Title": "Dream Interpreter",
    });

    const interpretation = await callOpenRouter(prompt, headers);
    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error("Error en la interpretación:", error);
    return NextResponse.json(
      { error: "Error processing dream interpretation" },
      { status: 500 }
    );
  }
}
