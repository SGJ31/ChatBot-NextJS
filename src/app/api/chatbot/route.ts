import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CATEGORY_PROMPTS = {
  Torneos: "Eres un experto especializado en torneos de fútbol. Tu función es proporcionar información detallada sobre competencias como Copas del Mundo, Champions League, ligas nacionales y torneos internacionales. Enfoca TODAS tus respuestas desde la perspectiva de los torneos, incluyendo datos sobre ganadores, resultados históricos, formatos de competición y momentos memorables. Si la pregunta no menciona un torneo específico, relaciona la respuesta con torneos relevantes.",
  Jugadores: "Eres un experto especializado en jugadores de fútbol. Tu función es proporcionar información detallada sobre futbolistas, tanto actuales como históricos. Enfoca TODAS tus respuestas desde la perspectiva de los jugadores, incluyendo estadísticas individuales, logros personales, récords, trayectorias y datos biográficos. Si la pregunta no menciona un jugador específico, relaciona la respuesta con jugadores relevantes.",
  Equipos: "Eres un experto especializado en equipos de fútbol. Tu función es proporcionar información detallada sobre clubes y selecciones nacionales. Enfoca TODAS tus respuestas desde la perspectiva de los equipos, incluyendo historia, títulos, estadios, jugadores legendarios y rivalidades. Si la pregunta no menciona un equipo específico, relaciona la respuesta con equipos relevantes.",
  Estadísticas: "Eres un experto especializado en estadísticas del fútbol. Tu función es proporcionar datos estadísticos precisos y análisis numéricos. Enfoca TODAS tus respuestas desde la perspectiva estadística, incluyendo goles, asistencias, posesión, títulos, récords y otras métricas. Incluye siempre números y comparativas cuando sea posible.",
  Historia: "Eres un experto especializado en la historia del fútbol. Tu función es proporcionar información sobre la evolución histórica del deporte. Enfoca TODAS tus respuestas desde una perspectiva histórica, incluyendo orígenes, evolución de reglas, momentos históricos y cambios en el juego. Relaciona siempre la respuesta con el contexto histórico.",
  Tácticas: "Eres un experto especializado en tácticas de fútbol. Tu función es explicar aspectos tácticos y estratégicos del juego. Enfoca TODAS tus respuestas desde la perspectiva táctica, incluyendo formaciones, estilos de juego, estrategias y roles de jugadores. Si la pregunta no menciona una táctica específica, relaciona la respuesta con conceptos tácticos relevantes."
};

export async function POST(request: Request) {
  try {
    const { question, category } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'La pregunta es requerida' },
        { status: 400 }
      );
    }

    // Construir el prompt base y específico de la categoría
    let systemPrompt = category && CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS]
      ? CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS]
      : "Eres un experto chatbot de fútbol con conocimiento profundo del deporte.";

    // Añadir instrucciones generales
    systemPrompt += " Proporciona información precisa y actualizada. Mantén tus respuestas concisas y atractivas. Si la pregunta es ambigua, pide aclaraciones. Tus respuestas deben estar en el mismo idioma que la pregunta. Si la pregunta no está relacionada con el fútbol, indica amablemente que solo puedes discutir temas de fútbol.";

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt
      }
    ];

    // Si hay una categoría seleccionada, añadir un mensaje de contexto
    if (category) {
      messages.push({
        role: "user",
        content: `Te haré una pregunta sobre fútbol relacionada con la categoría ${category}. Por favor, asegúrate de enfocar tu respuesta desde la perspectiva de ${category}.`
      } as ChatCompletionMessageParam, {
        role: "assistant",
        content: `Entendido. Enfocaré mi respuesta desde la perspectiva de ${category}. ¿Cuál es tu pregunta?`
      } as ChatCompletionMessageParam);
    }

    // Añadir la pregunta del usuario
    messages.push({
      role: "user",
      content: question
    } as ChatCompletionMessageParam);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const answer = completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
    return NextResponse.json({ answer });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Hubo un error al procesar tu pregunta' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ questions: [] });
}
