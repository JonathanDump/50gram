import { Server } from "socket.io";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { envReader } from "../functions/functions";
import jwtDecode from "jwt-decode";
import { DecodedJwt } from "../interfaces/interfaces";

export default function socketHandlerUser(io: Server) {
  let usersOnline: { userId: string; socketId: string }[] = [];
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
    console.log("socket", socket.handshake.auth);

    if (socket.handshake.auth.token == null) {
      console.log("invalid token");

      socket.emit("invalid token");
    }
    if (socket.handshake.auth.token != null) {
      console.log("handshake auth", socket.handshake.auth.token);

      console.log("decoding token");

      const decodedJwt: DecodedJwt = jwtDecode(
        socket.handshake.auth.token as string
      );
      console.log("decoded token", decodedJwt);

      const userIds = { socketId: socket.id, userId: decodedJwt.user._id };
      usersOnline.find((user) => user.userId === userIds.userId) ||
        usersOnline.push(userIds);

      io.emit("online", usersOnline);
    }

    console.log("users online", usersOnline);

    socket.on("getAllUsers", async ({ id }) => {
      const allUsers = await User.find({
        _id: { $ne: id },
      })
        .select("id name img")
        .exec();

      socket.emit("allUsers", allUsers);
    });

    socket.on("signUpUser", (user) => {
      console.log("signing up the user");

      socket.broadcast.emit("updateUserList", user);
    });

    socket.on("disconnect", () => {
      console.log("disconnect");

      usersOnline = usersOnline.filter((user) => user.socketId !== socket.id);
      io.emit("disconnected", usersOnline);
      console.log("final users online", usersOnline);
      socket.emit("disconnect user");
    });
  });
}
