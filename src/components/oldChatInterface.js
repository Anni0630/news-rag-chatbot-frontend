import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../styles/ChatInterface.scss';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
    // 💡 1. Create a ref for the MessageList container
  const messagesEndRef = useRef(null); 

    // 💡 2. Define the scroll function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

  useEffect(() => {
    // Initialize socket connection
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    console.log('🔌 Connecting to backend:', backendUrl);
    
    socketRef.current = io(backendUrl);

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    socketRef.current.on('session_initialized', (data) => {
      console.log('🆕 Session initialized:', data.sessionId);
      setSessionId(data.sessionId);
      
      // Store session ID in localStorage for persistence
      localStorage.setItem('news_chat_session', data.sessionId);
    });

    socketRef.current.on('receive_message', (message) => {
      console.log('📨 Received message:', message);
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    });

    socketRef.current.on('bot_typing', (data) => {
      console.log('✍️ Bot typing:', data.typing);
      setIsTyping(data.typing);
    });

    socketRef.current.on('chat_history', (history) => {
      console.log('📖 Received chat history:', history.length, 'messages');
      setMessages(history);
    });

    socketRef.current.on('history_cleared', () => {
      console.log('🧹 History cleared');
      setMessages([]);
    });

    socketRef.current.on('error', (error) => {
      console.error('❌ Socket error:', error);
      alert(`Error: ${error.message}`);
    });

    // Check for existing session
    const existingSession = localStorage.getItem('news_chat_session');
    if (existingSession) {
      setSessionId(existingSession);
      // Load existing history
      socketRef.current.emit('get_chat_history', { sessionId: existingSession });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

    // 💡 3. Use a second useEffect hook to call scrollToBottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

  const sendMessage = (content) => {
    if (!content.trim()) {
      alert('Please enter a message');
      return;
    }

    if (!sessionId) {
      alert('Session not initialized yet. Please wait...');
      return;
    }

    if (!isConnected) {
      alert('Not connected to server. Please check your connection.');
      return;
    }

    console.log('📤 Sending message:', content);
    
    const userMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    socketRef.current.emit('send_message', {
      message: content,
      sessionId: sessionId
    });
  };

  const clearHistory = () => {
    if (sessionId && window.confirm('Are you sure you want to clear the chat history?')) {
      console.log('🧹 Clearing history for session:', sessionId);
      socketRef.current.emit('clear_history', { sessionId });
    }
  };

  const loadHistory = () => {
    if (sessionId) {
      console.log('📖 Loading history for session:', sessionId);
      socketRef.current.emit('get_chat_history', { sessionId });
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <h2>💬 News Chat</h2>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            ● {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <div className="chat-controls">
          <button 
            onClick={loadHistory} 
            className="btn btn-secondary"
            disabled={!isConnected}
          >
            📖 Load History
          </button>
          <button 
            onClick={clearHistory} 
            className="btn btn-danger"
            disabled={!isConnected}
          >
            🧹 Clear Chat
          </button>
        </div>
      </div>
      
      <MessageList 
        messages={messages} 
        isTyping={isTyping}
      />
        
        {/* 💡 4. Add an invisible div at the end of the MessageList to serve as the scroll target */}
        <div ref={messagesEndRef} />
      
      <MessageInput 
        onSendMessage={sendMessage}
        disabled={!isConnected || isTyping}
      />
      
      {sessionId && (
        <div className="session-info">
          Session: {sessionId.substring(0, 8)}... 
          {isTyping && ' | 🤖 AI is typing...'}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;