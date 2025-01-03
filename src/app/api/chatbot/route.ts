import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function POST(request: Request) {
  const { question } = await request.json();

  // Ruta al archivo CSV
  const filePath = path.join(process.cwd(), 'public', 'data.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Parsear el CSV
  const parsedData = Papa.parse(fileContent, { header: true });
  const data = parsedData.data as { Pregunta: string; Respuesta: string }[];

  // Buscar la respuesta
  const match = data.find((item) =>
    item.Pregunta.toLowerCase() === question.toLowerCase()
  );

  if (match) {
    return NextResponse.json({ answer: match.Respuesta });
  } else {
    return NextResponse.json({
      answer: 'Lo siento, no tengo esa información.',
    });
  }
}
