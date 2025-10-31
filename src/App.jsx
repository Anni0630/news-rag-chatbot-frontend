import React from 'react';
import ChatInterface from './components/ChatInterface';
import './styles/App.scss';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📰 News RAG Chatbot</h1>
        <p>Ask questions about recent news articles powered by AI</p>
      </header>
      <main className="app-main">
        <ChatInterface />
      </main>
      <footer className="app-footer">
        <p>Powered by React, Node.js, Qdrant, and Google Gemini</p>
      </footer>
    </div>
  );
}

export default App;