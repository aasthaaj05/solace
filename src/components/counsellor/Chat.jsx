import React, { useState, useEffect } from "react";
import { Client } from "@twilio/conversations";

const Chat = ({ userId }) => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initializeChat = async () => {
      const response = await fetch(
        `https://your-firebase-cloud-function-url/generateToken?identity=${userId}`
      );
      const data = await response.json();
      const chatClient = new Client(data.token);
      setClient(chatClient);
    };
    initializeChat();
  }, [userId]);

  const sendMessage = async () => {
    if (client && message) {
      await client.sendMessage(message);
      setMessages([...messages, { body: message, sender: "You" }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Twilio Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.sender}:</strong> {msg.body}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
