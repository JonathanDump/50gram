import { Server } from "socket.io";
import User from "../models/user";

export default function socketHandler(io: Server) {
  io.on("connect", (socket) => {
    console.log("connection created");

    socket.on("getAllUsers", async ({ id }) => {
      console.log("id", id);

      const allUsers = await User.find({
        _id: { $ne: id },
      }).exec();
      console.log("allUsers", allUsers);

      socket.emit("allUsers", allUsers);
    });

    socket.on("signUpUser", async () => {});
  });
}
