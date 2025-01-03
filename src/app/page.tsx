'use client';

import { useState } from 'react';

export default function ChatbotPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    setAnswer(data.answer);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Chatbot</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            placeholder="Haz tu pregunta..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Preguntar
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
