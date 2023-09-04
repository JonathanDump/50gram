import { Server } from "socket.io";
import User from "../models/user";

export default function socketHandler(io: Server) {
  io.on("connect", (socket) => {
    console.log("connection created");

    socket.on("getAllUsers", async ({ id }) => {
      console.log("id", id);

      const allUsers = await User.find({
        _id: { $ne: id },
      })
        .select("id name img")
        .exec();
      console.log("allUsers", allUsers);

      socket.emit("allUsers", allUsers);
    });

    socket.on("signUpUser", (user) => {
      console.log("signing up the user");

      socket.broadcast.emit("updateUserList", user);
    });
  });
}
