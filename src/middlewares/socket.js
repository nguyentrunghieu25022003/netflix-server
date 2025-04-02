const socket = require("socket.io");
const corsHelper = require("../helper/cors");

const initSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: corsHelper.options,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Authorization", "Content-Type"],
    }
  });
  
  io.on("connection", (socket) => {
    console.log("User connected...");
    socket.on("disconnect", () => {
      console.log("User disconnected...");
    });
  });
  return io;
};

module.exports = initSocket;