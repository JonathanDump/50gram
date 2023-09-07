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
    console.log("handshake", socket.handshake.headers);

    const decodedJwt: DecodedJwt = jwtDecode(
      socket.handshake.headers.authorization as string
    );
    console.log("decoded jwt", decodedJwt);

    const userIds = { socketId: socket.id, userId: decodedJwt.user._id };
    usersOnline.find((user) => user.userId === userIds.userId) ||
      usersOnline.push(userIds);

    console.log("users online", usersOnline);

    io.emit("online", usersOnline);

    socket.on("getAllUsers", async ({ id }) => {
      console.log("id", id);

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
      usersOnline = usersOnline.filter((user) => user.socketId !== socket.id);
      io.emit("disconnected", usersOnline);
      console.log(usersOnline);
    });
  });
}
