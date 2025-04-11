const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const chatrooms = {}; // { roomName: [{ id, avatar }] }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", ({ room, avatar }) => {
    socket.join(room);
    socket.room = room;
    socket.avatar = avatar;

    if (!chatrooms[room]) chatrooms[room] = [];
    chatrooms[room].push({ id: socket.id, avatar });

    // Notify all clients in the room that a user joined
    io.to(room).emit("user_joined", { avatar, message: "joined the chat!" });

    // Send the updated list of users in the room
    const onlineUsers = chatrooms[room].map(user => user.avatar);
    io.to(room).emit("room_users", onlineUsers);
  });

  socket.on("chat_message", ({ room, avatar, message }) => {
    io.to(room).emit("chat_message", { avatar, message });
  });

  socket.on("disconnect", () => {
    const { room, avatar } = socket;
    if (room && chatrooms[room]) {
      // Remove user from room
      chatrooms[room] = chatrooms[room].filter(user => user.id !== socket.id);

      // Update the user list for everyone still in the room
      const onlineUsers = chatrooms[room].map(user => user.avatar);
      io.to(room).emit("room_users", onlineUsers);

      // Notify others in the room
      io.to(room).emit("user_left", { avatar, message: "left the chat." });
    }

    console.log("A user disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
