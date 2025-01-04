import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Función para calcular la distancia de Levenshtein (para tolerancia a errores ortográficos)
const levenshteinDistance = (str1: string, str2: string) => {
  const matrix = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null)
  );

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  return matrix[str2.length][str1.length];
};

  // Función para normalizar texto (remover acentos y caracteres especiales)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, '');     // Remove special characters
  };

// Función para calcular la similitud entre dos strings
const similarity = (str1: string, str2: string) => {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  const words1 = s1.split(' ').filter(word => word.length > 2); // Ignore very short words
  const words2 = s2.split(' ').filter(word => word.length > 2);
  
  let matches = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      // Consider words similar if they share most characters
      if (levenshteinDistance(word1, word2) <= Math.min(2, Math.floor(word1.length * 0.3))) {
        matches++;
        break;
      }
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
};

export async function POST(request: Request) {
  const { question } = await request.json();

  const filePath = path.join(process.cwd(), 'public', 'data.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const parsedData = Papa.parse(fileContent, { header: true });
  const data = parsedData.data as { Pregunta: string; Respuesta: string }[];

  // Buscar la mejor coincidencia
  let bestMatch = null;
  let highestSimilarity = 0;

  data.forEach((item) => {
    const similarityScore = similarity(item.Pregunta, question);
    if (similarityScore > highestSimilarity && similarityScore > 0.4) {
      highestSimilarity = similarityScore;
      bestMatch = item;
    }
  });

  if (bestMatch) {
    return NextResponse.json({ answer: bestMatch.Respuesta });
  } else {
    return NextResponse.json({
      answer: 'Lo siento, no tengo esa información.',
    });
  }
}

export async function GET(request: Request) {
  const filePath = path.join(process.cwd(), 'public', 'data.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const parsedData = Papa.parse(fileContent, { header: true });
  const data = parsedData.data as { Pregunta: string; Respuesta: string }[];
  // Sort questions by similarity if a search parameter is provided
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('search') || '';

  console.log(searchQuery);

  if (searchQuery) {
    const matches = data
      .map(item => ({
        question: item.Pregunta,
        similarity: similarity(item.Pregunta, searchQuery)
      }));
    
    console.log('Search query:', searchQuery);
    console.log('Matches:', matches);
    
    const sortedQuestions = matches
      .filter(item => item.similarity > 0.2)
      .sort((a, b) => b.similarity - a.similarity)
      .map(item => item.question);

    return NextResponse.json({ questions: sortedQuestions });
  }
  
  // If no search query, return all questions
  const questions = data.map(item => item.Pregunta);
  return NextResponse.json({ questions });
}
