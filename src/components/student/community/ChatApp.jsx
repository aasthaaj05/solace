import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { openDB } from "idb";
import "./styles.css"; // Import CSS file for styling

const socket = io("http://localhost:5000");

const ChatApp = () => {
  const [room, setRoom] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const chatrooms = ["Friends Corner", "Safe Haven", "Soul Space", "Chai Katta"];
  const avatars = ["🐱", "🐶", "🐼", "🐸"];

  useEffect(() => {
    const fetchMessages = async () => {
      if (room) {
        const db = await openDB("chatDB", 1, {
          upgrade(db) {
            db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
          },
        });

        const allMessages = await db.getAll("messages");
        const roomMessages = allMessages.filter((msg) => msg.room === room);
        setMessages(roomMessages);
      }
    };

    fetchMessages();
  }, [room]);

  const joinRoom = (roomName) => {
    setRoom(roomName);
  };

  const selectAvatar = (av) => {
    setAvatar(av);
    socket.emit("join_room", { room, avatar: av });
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const msgData = { room, avatar, message };

      socket.emit("chat_message", msgData);
      setMessage("");

      const db = await openDB("chatDB", 1);
      await db.add("messages", msgData);
    }
  };

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat_message");
    };
  }, []);

  return (
    <div className="chat-container">
      {!room ? (
        <div className="room-selection">
          <h2>Choose a Chatroom</h2>
          <div className="room-buttons">
            {chatrooms.map((r) => (
              <button key={r} onClick={() => joinRoom(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      ) : !avatar ? (
        <div className="avatar-selection">
          <h2>Select an Avatar</h2>
          <div className="avatar-buttons">
            {avatars.map((a) => (
              <button key={a} onClick={() => selectAvatar(a)}>
                {a}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-box">
          <h2 className="chat-title">{room} Chat</h2>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.avatar === avatar ? "self" : ""}`}>
                <span className="avatar">{msg.avatar}</span>
                <span className="message-text">{msg.message}</span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;