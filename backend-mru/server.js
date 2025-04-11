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

const chatrooms = {}; // Stores users by chatroom

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", ({ room, avatar }) => {
    socket.join(room);
    if (!chatrooms[room]) chatrooms[room] = [];
    chatrooms[room].push({ id: socket.id, avatar });

    io.to(room).emit("user_joined", { avatar, message: "joined the chat!" });
  });

  socket.on("chat_message", ({ room, avatar, message }) => {
    io.to(room).emit("chat_message", { avatar, message });
  });

  socket.on("disconnect", () => {
    for (const room in chatrooms) {
      chatrooms[room] = chatrooms[room].filter((user) => user.id !== socket.id);
    }
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
