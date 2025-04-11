import React, { useState, useRef, useEffect } from "react";
import { sendMessage } from "./api";
import "./chatbot.css"; // Style file

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    const response = await sendMessage(input);
    setMessages([...newMessages, { text: response.answer, sender: "bot" }]);
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
      {!isOpen && (
        <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
          💬
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Chat with us</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-body">
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <p key={index} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
                  {msg.text}
                </p>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
