import React, { useState, useRef, useEffect } from 'react';
import './ChatModal.css';

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là AI Support của Agenl. Tôi có thể giúp gì cho bạn?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Thêm tin nhắn của user
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: 'Cảm ơn bạn đã liên hệ! Tôi đã nhận được tin nhắn của bạn. Đội ngũ hỗ trợ sẽ phản hồi sớm nhất có thể.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-modal show" onClick={onClose}>
      <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="chat-modal-header">
          <div className="chat-header-info">
            <i className="fas fa-headset"></i>
            <div>
              <h3>Agenl AI Support</h3>
              <span className="chat-status">Đang trực tuyến</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="chat-messages" id="chatMessages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSend}>
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Nhập tin nhắn của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              autoFocus
            />
            <button type="submit" className="chat-send-btn" disabled={!inputMessage.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;

