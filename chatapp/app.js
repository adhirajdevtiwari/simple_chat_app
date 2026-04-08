import express from "express";
import { Server } from "socket.io";
import http from "http";
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let socketsConnectedset = new Set();
io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);
  socketsConnectedset.add(socket);

  io.emit("client Total", socketsConnectedset.size);

  
  socket.on("message", (data) => {
      console.log(data);
      
      socket.broadcast.emit("chat-message", data);
    });
      socket.on("disconnect", () => {
    console.log("a user disconnected" + socket.id);
    socketsConnectedset.delete(socket);
    io.emit("client Total", socketsConnectedset.size);
  });

});





const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Please kill the process or use another port.`,
    );
    process.exit(1);
  } else {
    console.error("Server error:", err);
  }
});
