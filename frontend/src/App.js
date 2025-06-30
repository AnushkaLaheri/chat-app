// App.js
import React, { useEffect, useState, useRef } from 'react';
import './styles/chat.css';
import EmojiPicker from 'emoji-picker-react';

function App() {
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const msgEndRef = useRef();

  useEffect(() => {
    if (isConnected) {
      const socket = new WebSocket(process.env.REACT_APP_WS_URL);
      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'join', username }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'history') {
          setMessages(data.messages);
        } else if (data.type === 'new_message') {
          setMessages((prev) => [...prev, data]);
        }
      };

      setWs(socket);
      return () => socket.close();
    }
  }, [isConnected, username]);

  const sendMessage = () => {
    if (input.trim() && ws) {
      ws.send(JSON.stringify({ type: 'message', message: input }));
      setInput('');
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isConnected) {
    return (
        <div className="login-screen">
            <div className="login-container">
            <h2>Join Chat Room</h2>
            <input placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
            <button onClick={() => setIsConnected(true)}>Enter</button>
            </div>
        </div>
);

  }

  return (
    <div className={darkMode ? "chat-container dark" : "chat-container"}>
      <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      <div className="chat-header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
          alt="User Avatar"
          className="avatar"
        />
        <div className="chat-header-text">
          <h3>Chat Room</h3>
          <p>Logged in as <strong>{username}</strong></p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div className={`chat-bubble ${msg.username === username ? 'self' : 'other'}`}>
  <div className="chat-meta">{msg.username}</div>
  <div className="chat-text">{msg.message}</div>
  <div className="chat-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
</div>

        ))}
        <div ref={msgEndRef} />
      </div>

      <div className="chat-input">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="emoji-toggle"
        >
          😊
        </button>

        {showEmojiPicker && (
          <div className="emoji-box">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setInput((prev) => prev + emojiData.emoji);
              }}
              theme={darkMode ? "dark" : "light"}
            />
          </div>
        )}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="send-btn">➤</button>
      </div>
    </div>
  );
}

export default App;
