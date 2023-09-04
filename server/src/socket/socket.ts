import { Server } from "socket.io";
import User from "../models/user";

export default function socketHandler(io: Server) {
  io.on("connection", (socket) => {
    console.log("connection created");

    socket.on("getAllUsers", async () => {
      const allUsers = await User.find({
        _id: { $ne: socket.handshake.query.id },
      }).exec();

      socket.emit("allUsers", allUsers);
    });
  });
}
