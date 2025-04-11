import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { openDB } from "idb";
import "./styles.css";

const socket = io("http://localhost:5000");

const ChatApp = () => {
  const [room, setRoom] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]); // 🌟 New state

  const chatrooms = ["Peaceful Pause", "Safe Haven", "Soul Space", "Hype Hub"];
  const avatars = ["🐱", "🐶", "🐼", "🐸"];

  // Load messages from IndexedDB when a room is joined
  useEffect(() => {
    const fetchMessages = async () => {
      if (room) {
        const db = await openDB("chatDB", 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains("messages")) {
              db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
            }
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

  // Handle incoming messages & room updates
  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleRoomUsers = (users) => {
      setOnlineUsers(users); // 🌟 Update user list
    };

    const handleUserJoined = (data) => {
      setMessages((prev) => [
        ...prev,
        { avatar: data.avatar, message: data.message, system: true },
      ]);
    };

    const handleUserLeft = (data) => {
      setMessages((prev) => [
        ...prev,
        { avatar: data.avatar, message: data.message, system: true },
      ]);
    };

    socket.on("chat_message", handleMessage);
    socket.on("room_users", handleRoomUsers);
    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);

    return () => {
      socket.off("chat_message", handleMessage);
      socket.off("room_users", handleRoomUsers);
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);
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

          {/* 🌟 Online Users Display */}
          <div className="online-users">
            <h4>Online:</h4>
            <div className="user-list">
              {onlineUsers.map((user, index) => (
                <span
                  key={index}
                  className={`online-avatar ${user === avatar ? "you" : ""}`}
                  title={user === avatar ? "You" : ""}
                >
                  {user}
                </span>
              ))}
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.system ? "system" : msg.avatar === avatar ? "self" : ""}`}
              >
                {!msg.system && <span className="avatar">{msg.avatar}</span>}
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
