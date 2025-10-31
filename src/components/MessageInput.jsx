import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Connecting..." : "Ask about recent news..."}
          disabled={disabled}
          className="message-input-field"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || disabled}
          className="send-button"
          title="Send message"
        >
          {disabled ? '⏳' : '📤'}
        </button>
      </div>
      <div className="input-hint">
        Press Enter to send • Shift+Enter for new line
      </div>
    </form>
  );
};

export default MessageInput;