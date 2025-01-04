'use client';

import { useState, useEffect } from 'react';

export default function ChatbotPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allQuestions, setAllQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);

  useEffect(() => {
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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuestion(value);
    setIsSuggestionSelected(false);

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
    setIsSuggestionSelected(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const text = await response.text(); // First get the response as text
      const data = text ? JSON.parse(text) : {}; // Then parse it if it's not empty
      
      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer('No se recibió una respuesta válida del servidor.');
      }
    } catch (error) {
      console.error('Error:', error);
      setAnswer('Lo siento, hubo un error al procesar tu pregunta.');
    } finally {
      setIsLoading(false);
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Chatbot</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Haz tu pregunta..."
              value={question}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              disabled={isLoading}
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b mt-[-10px] max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !isSuggestionSelected}
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center ${
              (isLoading || !isSuggestionSelected) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              'Preguntar'
            )}
          </button>
        </form>
        {answer && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <p className="font-semibold">Respuesta:</p>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
