# Soccer Guru - AI-Powered Soccer Knowledge Chatbot

![Soccer Guru Logo](public/soccer-pattern.jpg)

## Overview

Soccer Guru is an interactive AI-powered chatbot application built with Next.js that provides comprehensive information about soccer/football. The application offers a modern, user-friendly interface where users can ask questions about various aspects of the sport, from historical data to current statistics.

## Features

- 🤖 **AI-Powered Responses**: Get intelligent answers to your soccer-related questions
- 📱 **Responsive Design**: Beautiful and functional across all devices
- 🎯 **Category-Based Questions**: Filter questions by specific categories:
  - 🏆 Tournaments
  - 👥 Players
  - 🏟️ Teams
  - 📊 Statistics
  - 📜 History
  - ⚔️ Tactics
- ⚡ **Quick Suggestions**: Access popular questions with one click
- ✨ **Typing Animation**: Smooth typing animation for answers
- 🎨 **Modern UI**: Clean and intuitive interface with a soccer-themed design

## Technology Stack

- **Frontend**: Next.js 13+ (React)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SGJ31/ChatBot-NextJS
```

2. Navigate to the project directory:
```bash
cd soccer-guru
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Select a category (optional) to focus your questions on a specific aspect of soccer
2. Type your question in the input field or select one of the quick suggestions
3. Click "Consultar al Guru" or press Enter to get your answer
4. The AI will process your question and provide a detailed response

## Project Structure

```
soccer-guru/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chatbot/
│   │   │       └── route.ts
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── favicon.ico
│   ├── components/
│   │   └── ChatInterface.tsx
│   └── styles/
│       └── globals.css
├── public/
│   └── soccer-pattern.jpg
└── package.json
```

## Acknowledgments

- Built with Next.js and Tailwind CSS
- Soccer pattern background and icons
- All contributors and maintainers

---

Made with ⚽ by [Santiago Jaimes]


