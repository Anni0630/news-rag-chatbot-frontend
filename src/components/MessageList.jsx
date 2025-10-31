import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="message-list">
      {messages.length === 0 && !isTyping ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>Welcome to News RAG Chatbot!</h3>
          <p>Ask me anything about recent news articles.</p>
          <p>Try questions like:</p>
          <ul>
            <li>"What are the top news stories today?"</li>
            <li>"Tell me about recent technology developments"</li>
            <li>"What's happening in politics?"</li>
          </ul>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">
                {message.content}
              </div>
              <div className="message-timestamp">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))
      )}
      
      {isTyping && (
        <div className="message bot-message typing-indicator">
          <div className="message-avatar">
            🤖
          </div>
          <div className="message-content">
            <div className="message-text">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} className="scroll-anchor" />
    </div>
  );
};

export default MessageList;