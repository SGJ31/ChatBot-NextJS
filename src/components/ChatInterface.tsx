'use client';

import { useState } from 'react';

interface ChatInterfaceProps {
  category: string | null;
}

export default function ChatInterface({ category }: ChatInterfaceProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');

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
        body: JSON.stringify({ question, category }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else if (data.answer) {
        setIsTyping(true);
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
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="¿Qué quieres saber sobre fútbol?"
            value={question}
            onChange={handleInputChange}
            className="w-full border-2 border-green-300 rounded-full px-6 py-4 mb-2 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-gray-700 bg-white/80 backdrop-blur-sm"
            disabled={isLoading}
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white/95 backdrop-blur-sm border border-green-200 rounded-2xl mt-1 shadow-xl max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-6 py-3 hover:bg-green-50 cursor-pointer transition-colors border-b border-green-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        {error && (
          <div className="text-red-500 text-sm mb-2 px-4">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading || !question.trim() || (answer !== '')}
          className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-full font-medium hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center ${
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
        <div className="p-6 bg-green-50 rounded-2xl border border-green-200 shadow-inner">
          <h2 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Respuesta del Guru
            {category && (
              <span className="text-sm font-normal bg-green-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                {category}
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
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-white/50 rounded-xl p-4 border border-green-100">
            {category && (
              <div className="mb-2 text-sm text-green-600 italic">
                Respondiendo desde la perspectiva de {category.toLowerCase()}...
              </div>
            )}
            {answer}
          </div>
        </div>
      )}
    </div>
  );
} 