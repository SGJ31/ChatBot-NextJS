'use client';

import { useState, useEffect } from 'react';

const QUICK_SUGGESTIONS = [
  { icon: "🏆", text: "¿Quién ganó el último Mundial?" },
  { icon: "⭐", text: "¿Quién es el mejor jugador de la historia?" },
  { icon: "🏃", text: "¿Cuál es el jugador más rápido?" },
  { icon: "🥅", text: "¿Cuál es el máximo goleador de todos los tiempos?" },
];

const CATEGORIES = [
  { icon: "🏆", name: "Torneos" },
  { icon: "👥", name: "Jugadores" },
  { icon: "🏟️", name: "Equipos" },
  { icon: "📊", name: "Estadísticas" },
  { icon: "📜", name: "Historia" },
  { icon: "⚔️", name: "Tácticas" },
];

export default function ChatbotPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allQuestions, setAllQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/chatbot')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data: { questions: string[] }) => setAllQuestions(data.questions))
      .catch(error => {
        console.error('Error fetching questions:', error);
        setAllQuestions([]);
      });
  }, []);

  if (!isMounted) {
    return null; // o un componente de carga
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuestion(value);
    setError('');

    if (value.trim()) {
      try {
        const response = await fetch(`/api/chatbot?search=${encodeURIComponent(value)}`);
        const data = await response.json();
        setSuggestions(data.questions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Por favor, escribe una pregunta');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, category: selectedCategory }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.answer) {
        setIsTyping(true);
        // Simular efecto de escritura
        let displayText = '';
        const words = data.answer.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          displayText += words[i] + ' ';
          setAnswer(displayText);
        }
        
        setIsTyping(false);
      } else {
        setError('No se recibió una respuesta válida del servidor.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Lo siento, hubo un error al procesar tu pregunta.');
    } finally {
      setIsLoading(false);
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-800 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4 bg-[url('/soccer-pattern.png')] bg-repeat">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-green-200 dark:border-gray-700">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <h1 className="text-4xl font-bold text-green-800 dark:text-green-200 flex items-center gap-3">
              ⚽ Soccer Guru
            </h1>
            <span className="absolute -top-1 -right-7 bg-green-500 dark:bg-green-600 text-white font-black text-xs px-2 py-1 rounded-full">AI</span>
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((category) => (
            <button
              key={category.name}
              onClick={() => selectedCategory === category.name ? setSelectedCategory('') : setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all ${
                selectedCategory === category.name
                  ? 'bg-green-600 dark:bg-green-700 text-white'
                  : 'bg-green-100 dark:bg-gray-700 text-green-800 dark:text-gray-200 hover:bg-green-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Sugerencias rápidas */}
        <div className="mb-6">
          <h3 className="text-green-800 dark:text-green-200 font-medium mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Preguntas Populares
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuestion(suggestion.text)}
                className="text-left px-4 py-3 bg-white dark:bg-gray-700 rounded-xl border border-green-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-gray-500 transition-all flex items-center gap-2"
              >
                <span className="text-xl">{suggestion.icon}</span>
                <span className="text-sm text-gray-700 dark:text-gray-200">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="¿Qué quieres saber sobre fútbol?"
              value={question}
              onChange={handleInputChange}
              className="w-full border-2 border-green-300 dark:border-gray-600 rounded-full px-6 py-4 mb-2 focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-gray-600 transition-all text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
              disabled={isLoading}
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-green-200 dark:border-gray-600 rounded-2xl mt-1 shadow-xl max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 hover:bg-green-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-green-100 dark:border-gray-600 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="text-gray-700 dark:text-gray-200">{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm mb-2 px-4">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading || !question.trim() || (answer !== '')}
            className={`w-full bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white py-4 rounded-full font-medium hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center ${
              (isLoading || !question.trim() || (answer !== '')) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analizando jugada...
              </>
            ) : (
              <>
                <span className="mr-2">⚽</span>
                Consultar al Guru
              </>
            )}
          </button>
        </form>

        {answer && (
          <div className="p-6 bg-green-50 dark:bg-gray-700 rounded-2xl border border-green-200 dark:border-gray-600 shadow-inner">
            <h2 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Respuesta del Guru
              {selectedCategory && (
                <span className="text-sm font-normal bg-green-600 dark:bg-green-700 text-white px-2 py-1 rounded-full flex items-center gap-1">
                  {CATEGORIES.find(cat => cat.name === selectedCategory)?.icon}
                  {selectedCategory}
                </span>
              )}
              {isTyping && (
                <span className="ml-2 flex gap-1">
                  <span className="animate-bounce delay-0">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </span>
              )}
            </h2>
            <div className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed bg-white/50 dark:bg-gray-600/50 rounded-xl p-4 border border-green-100 dark:border-gray-500">
              {selectedCategory && (
                <div className="mb-2 text-sm text-green-600 dark:text-green-400 italic">
                  Respondiendo desde la perspectiva de {selectedCategory.toLowerCase()}...
                </div>
              )}
              {answer}
            </div>
          </div>
        )}

        {/* Indicador de categoría seleccionada */}
        {selectedCategory && !answer && (
          <div className="text-center text-green-600 dark:text-green-400 text-sm mt-4 bg-green-50 dark:bg-gray-700 py-2 px-4 rounded-full inline-block">
            <span className="mr-2">📌</span>
            Preguntas enfocadas en: {selectedCategory}
          </div>
        )}
      </div>
    </div>
  );
}
