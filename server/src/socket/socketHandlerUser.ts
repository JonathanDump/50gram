import { Server } from "socket.io";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { envReader } from "../functions/functions";

export default function socketHandlerUser(io: Server) {
  // io.use((socket, next) => {
  //   if (socket.handshake.headers.authorization) {
  //     const token = socket.handshake.headers.authorization.split(" ")[1];
  //     console.log("token", token);

  //     jwt.verify(token, envReader("SECRET_KEY"), function (err, decoded) {
  //       console.log("decoded");

  //       if (err) {
  //         console.log("err", err);

  //         return next(new Error("Authentication error"));
  //       }

  //       next();
  //     });
  //   } else {
  //     next(new Error("Authentication error"));
  //   }
  // });

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
